package com.globalchain.ui.screens.upload

import android.content.Context
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.globalchain.data.models.Supplier
import com.globalchain.navigation.Screen
import com.globalchain.ui.screens.dashboard.DashboardSection
import com.globalchain.ui.screens.dashboard.KpiCard
import com.globalchain.ui.viewmodel.SupplierViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.apache.poi.ss.usermodel.DataFormatter
import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.UUID

// ── Upload Result ─────────────────────────────────────────────────────────────
data class UploadResult(
    val inserted: Int,
    val skipped: Int,
    val errors: List<String>,
    val warnings: List<String>
)

// ── CSV Parsing Engine ────────────────────────────────────────────────────────
fun parseCsvToSuppliers(context: Context, uri: Uri): Pair<List<Supplier>, List<String>> {
    val suppliers = mutableListOf<Supplier>()
    val errors = mutableListOf<String>()

    try {
        val stream = context.contentResolver.openInputStream(uri) ?: run {
            errors.add("Cannot open file")
            return suppliers to errors
        }
        val reader = BufferedReader(InputStreamReader(stream))
        val headerLine = reader.readLine() ?: run {
            errors.add("File is empty")
            return suppliers to errors
        }

        val headers = headerLine.split(",").map { it.trim().lowercase().replace(" ", "_") }
        val required = listOf("name", "lat", "lng", "tier_level")
        val missing = required.filter { it !in headers }
        if (missing.isNotEmpty()) {
            errors.add("Missing required columns: ${missing.joinToString(", ")}")
            return suppliers to errors
        }

        var lineNum = 1
        reader.lineSequence().forEach { line ->
            lineNum++
            if (line.isBlank()) return@forEach
            val values = line.split(",").map { it.trim() }
            if (values.size < headers.size) {
                errors.add("Line $lineNum: Insufficient columns (expected ${headers.size}, got ${values.size})")
                return@forEach
            }
            fun get(key: String) = headers.indexOf(key).takeIf { it >= 0 }?.let { values.getOrNull(it) }?.trim() ?: ""

            val name = get("name").ifBlank { errors.add("Line $lineNum: Missing name"); return@forEach }
            val lat = get("lat").toDoubleOrNull() ?: run { errors.add("Line $lineNum: Invalid lat '${get("lat")}'"); return@forEach }
            val lng = get("lng").toDoubleOrNull() ?: run { errors.add("Line $lineNum: Invalid lng '${get("lng")}'"); return@forEach }
            // Handle "1.0" format that Excel sometimes exports
            val tier = get("tier_level").toIntOrNull() ?: get("tier_level").toDoubleOrNull()?.toInt() ?: 1

            suppliers.add(Supplier(
                id = UUID.randomUUID().toString(),
                name = name,
                tierLevel = tier.coerceIn(1, 3),
                lat = lat,
                lng = lng,
                region = get("region").ifBlank { null },
                country = get("country").ifBlank { null },
                city = get("city").ifBlank { null },
                riskScore = get("risk_score").toDoubleOrNull() ?: 0.0,
                healthScore = get("health_score").toDoubleOrNull() ?: 100.0,
                qualityScore = get("quality_score").toDoubleOrNull() ?: 100.0,
                resilienceScore = get("resilience_score").toDoubleOrNull() ?: 100.0,
                category = get("category").ifBlank { null },
                isBackup = get("is_backup").lowercase() in listOf("true", "1", "yes"),
                dependsOn = get("depends_on").ifBlank { null }
            ))
        }
        stream.close()
    } catch (e: Exception) {
        errors.add("Parse error: ${e.message}")
    }
    
    autoLinkHierarchy(suppliers)
    return suppliers to errors
}

// ── Excel Parsing Engine ──────────────────────────────────────────────────────
fun parseExcelToSuppliers(context: Context, uri: Uri): Pair<List<Supplier>, List<String>> {
    val suppliers = mutableListOf<Supplier>()
    val errors = mutableListOf<String>()

    try {
        val stream = context.contentResolver.openInputStream(uri) ?: run {
            errors.add("Cannot open file")
            return suppliers to errors
        }

        // WorkbookFactory handles both .xls and .xlsx automatically
        val workbook = WorkbookFactory.create(stream)
        // Use DataFormatter to read ALL cells as formatted strings (handles numbers, dates etc.)
        val formatter = DataFormatter()
        val sheet = workbook.getSheetAt(0)

        val headerRow = sheet.getRow(0) ?: run {
            errors.add("Sheet is empty — no header row found")
            workbook.close()
            return suppliers to errors
        }

        // Read header names using DataFormatter for robust string extraction
        val headers = (0 until headerRow.lastCellNum).map { colIdx ->
            val cell = headerRow.getCell(colIdx)
            formatter.formatCellValue(cell)
                .trim()
                .lowercase()
                .replace(" ", "_")
                // Remove BOM and non-printable characters
                .filter { it.isLetterOrDigit() || it == '_' }
        }

        val required = listOf("name", "lat", "lng", "tier_level")
        val missing = required.filter { it !in headers }
        if (missing.isNotEmpty()) {
            errors.add("Missing required columns: ${missing.joinToString(", ")}. Found: ${headers.filter { it.isNotBlank() }.joinToString(", ")}")
            workbook.close()
            return suppliers to errors
        }

        // Safe cell reader using DataFormatter
        fun getCell(row: org.apache.poi.ss.usermodel.Row, key: String): String {
            val idx = headers.indexOf(key)
            if (idx < 0) return ""
            val cell = row.getCell(idx) ?: return ""
            return formatter.formatCellValue(cell).trim()
        }

        for (rowIdx in 1..sheet.lastRowNum) {
            val row = sheet.getRow(rowIdx) ?: continue
            // Skip completely empty rows
            if (row.cellIterator().asSequence().all { formatter.formatCellValue(it).isBlank() }) continue

            val name = getCell(row, "name")
            if (name.isBlank()) { errors.add("Row ${rowIdx + 1}: Missing name"); continue }

            val latStr = getCell(row, "lat")
            val lat = latStr.toDoubleOrNull()
            if (lat == null) { errors.add("Row ${rowIdx + 1}: Invalid lat '$latStr'"); continue }

            val lngStr = getCell(row, "lng")
            val lng = lngStr.toDoubleOrNull()
            if (lng == null) { errors.add("Row ${rowIdx + 1}: Invalid lng '$lngStr'"); continue }

            // Handle "1.0" Excel format → parse as double first then int
            val tierStr = getCell(row, "tier_level")
            val tier = tierStr.toIntOrNull() ?: tierStr.toDoubleOrNull()?.toInt() ?: 1

            val riskStr = getCell(row, "risk_score")
            val healthStr = getCell(row, "health_score")
            val qualityStr = getCell(row, "quality_score")
            val resilienceStr = getCell(row, "resilience_score")

            suppliers.add(Supplier(
                id = UUID.randomUUID().toString(),
                name = name,
                tierLevel = tier.coerceIn(1, 3),
                lat = lat,
                lng = lng,
                region = getCell(row, "region").ifBlank { null },
                country = getCell(row, "country").ifBlank { null },
                city = getCell(row, "city").ifBlank { null },
                riskScore = riskStr.toDoubleOrNull() ?: 20.0,
                healthScore = healthStr.toDoubleOrNull() ?: 80.0,
                qualityScore = qualityStr.toDoubleOrNull() ?: 80.0,
                resilienceScore = resilienceStr.toDoubleOrNull() ?: 80.0,
                category = getCell(row, "category").ifBlank { null },
                isBackup = getCell(row, "is_backup").lowercase() in listOf("true", "1", "yes"),
                dependsOn = getCell(row, "depends_on").ifBlank { null }
            ))
        }
        workbook.close()
        stream.close()
    } catch (e: Exception) {
        errors.add("Parse error: ${e.message}")
    }

    autoLinkHierarchy(suppliers)
    return suppliers to errors
}

// ── Edge Generator (Req 33) ───────────────────────────────────────────────────
private fun autoLinkHierarchy(suppliers: MutableList<Supplier>) {
    val tier1 = suppliers.filter { it.tierLevel == 1 }
    val tier2 = suppliers.filter { it.tierLevel == 2 }
    val mainHub = tier1.firstOrNull() // Best effort if multiple
    
    for (i in suppliers.indices) {
        val s = suppliers[i]
        if (s.dependsOn.isNullOrBlank()) {
            val target = when (s.tierLevel) {
                3 -> tier2.firstOrNull { it.category == s.category } ?: tier2.firstOrNull() ?: tier1.firstOrNull()
                2 -> tier1.firstOrNull { it.category == s.category } ?: tier1.firstOrNull()
                else -> mainHub.takeIf { it != s }
            }
            if (target != null) {
                suppliers[i] = s.copy(dependsOn = target.name)
            }
        }
    }
}

// ── Upload Hub ────────────────────────────────────────────────────────────────
@Composable
fun DataUploadHubScreen(navController: NavController) {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("DATA ENGINE", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Upload and manage your supply chain dataset", color = Color(0xFF64748B), fontSize = 11.sp)

        val options = listOf(
            UploadOption("CSV Upload", "Import from CSV file", Icons.Default.TableChart, Color(0xFF10B981), Screen.CsvUpload),
            UploadOption("Excel Upload", "Import from XLSX/XLS", Icons.Default.GridOn, Color(0xFF3B82F6), Screen.ExcelUpload),
            UploadOption("Data Mapping", "Configure field mappings", Icons.Default.AccountTree, Color(0xFFA855F7), Screen.DataMapping),
            UploadOption("Validation", "Review data quality", Icons.Default.FactCheck, Color(0xFFF59E0B), Screen.DataValidation),
            UploadOption("Templates", "Download upload templates", Icons.Default.Download, Color(0xFF06B6D4), Screen.DataTemplates),
            UploadOption("Upload Status", "Track ingestion status", Icons.Default.CloudDone, Color(0xFF14B8A6), Screen.DataStatus),
        )
        options.chunked(2).forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                row.forEach { opt ->
                    Card(modifier = Modifier.weight(1f).height(100.dp).clickable { navController.navigate(opt.screen.route) },
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(14.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, opt.color.copy(0.2f))) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Icon(opt.icon, null, tint = opt.color, modifier = Modifier.size(22.dp))
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(opt.title, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            Text(opt.subtitle, color = Color(0xFF64748B), fontSize = 9.sp)
                        }
                    }
                }
                if (row.size == 1) Spacer(modifier = Modifier.weight(1f))
            }
        }
    }
}

data class UploadOption(val title: String, val subtitle: String, val icon: androidx.compose.ui.graphics.vector.ImageVector, val color: Color, val screen: Screen)

// ── CSV Upload ────────────────────────────────────────────────────────────────
@Composable
fun CsvUploadScreen(navController: NavController, vm: SupplierViewModel = hiltViewModel()) {
    var selectedUri by remember { mutableStateOf<Uri?>(null) }
    var uploadResult by remember { mutableStateOf<UploadResult?>(null) }
    var isProcessing by remember { mutableStateOf(false) }
    var previewSuppliers by remember { mutableStateOf<List<Supplier>>(emptyList()) }
    var parseErrors by remember { mutableStateOf<List<String>>(emptyList()) }

    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        uri?.let {
            selectedUri = it
            uploadResult = null
            // Parse on selection
            scope.launch {
                isProcessing = true
                val (parsed, errors) = withContext(Dispatchers.IO) { parseCsvToSuppliers(context, it) }
                previewSuppliers = parsed
                parseErrors = errors
                isProcessing = false
            }
        }
    }

    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {

        Text("CSV UPLOAD", color = Color(0xFF10B981), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Import supply chain data from CSV file", color = Color(0xFF64748B), fontSize = 11.sp)

        // Drop zone
        Card(modifier = Modifier.fillMaxWidth().height(140.dp).clickable { launcher.launch("*/*") },
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp,
                if (selectedUri != null) Color(0xFF10B981).copy(0.5f) else Color.White.copy(0.1f))) {
            Column(modifier = Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center) {
                Icon(if (selectedUri != null) Icons.Default.CheckCircle else Icons.Default.UploadFile, null,
                    tint = if (selectedUri != null) Color(0xFF10B981) else Color(0xFF64748B), modifier = Modifier.size(38.dp))
                Spacer(modifier = Modifier.height(8.dp))
                Text(if (selectedUri != null) selectedUri!!.lastPathSegment ?: "File selected"
                    else "Tap to select CSV / TXT file",
                    color = if (selectedUri != null) Color(0xFF10B981) else Color(0xFF64748B), fontSize = 12.sp)
                if (selectedUri == null) Text("Required columns: name, tier_level, lat, lng",
                    color = Color(0xFF475569), fontSize = 10.sp)
            }
        }

        // Parse preview
        if (isProcessing) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                CircularProgressIndicator(color = Color(0xFF10B981), modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(12.dp))
                Text("Parsing file...", color = Color(0xFF64748B), fontSize = 12.sp)
            }
        }

        if (parseErrors.isNotEmpty()) {
            DashboardSection("VALIDATION ERRORS (${parseErrors.size})") {
                parseErrors.take(5).forEach { err ->
                    Row(modifier = Modifier.padding(vertical = 3.dp)) {
                        Icon(Icons.Default.Error, null, tint = Color(0xFFEF4444), modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(err, color = Color(0xFFEF4444), fontSize = 10.sp)
                    }
                }
                if (parseErrors.size > 5) Text("... +${parseErrors.size - 5} more errors", color = Color(0xFF64748B), fontSize = 10.sp)
            }
        }

        if (previewSuppliers.isNotEmpty()) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                KpiCard("Parsed", previewSuppliers.size.toString(), Color(0xFF10B981), Modifier.weight(1f))
                KpiCard("Errors", parseErrors.size.toString(), if (parseErrors.isEmpty()) Color(0xFF10B981) else Color(0xFFEF4444), Modifier.weight(1f))
                KpiCard("Tier 1", previewSuppliers.count { it.tierLevel == 1 }.toString(), Color(0xFF3B82F6), Modifier.weight(1f))
            }
            DashboardSection("PREVIEW (first 5 rows)") {
                previewSuppliers.take(5).forEach { s ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(s.name, color = Color.White, fontSize = 11.sp, modifier = Modifier.weight(1f))
                        Text("T${s.tierLevel}", color = Color(0xFF3B82F6), fontSize = 10.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("${s.lat.format(2)}, ${s.lng.format(2)}", color = Color(0xFF64748B), fontSize = 10.sp)
                    }
                    Divider(color = Color.White.copy(0.04f))
                }
            }
        }

        // Upload result banner
        uploadResult?.let { result ->
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF10B981).copy(0.1f)),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF10B981).copy(0.4f)),
                shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("✅ Upload Complete", color = Color(0xFF10B981), fontWeight = FontWeight.Bold)
                    Text("${result.inserted} suppliers inserted • ${result.skipped} skipped",
                        color = Color(0xFF94A3B8), fontSize = 12.sp)
                    if (result.errors.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("${result.errors.size} rows had errors and were skipped.", color = Color(0xFFF59E0B), fontSize = 11.sp)
                    }
                }
            }
        }

        Button(
            onClick = {
                scope.launch {
                    isProcessing = true
                    var inserted = 0
                    val errors = mutableListOf<String>()
                    
                    // Clear existing data before upload (Single Source of Truth)
                    withContext(Dispatchers.IO) { vm.deleteAllSuppliers() }
                    
                    previewSuppliers.forEach { s ->
                        val ok = withContext(Dispatchers.IO) { vm.addSync(s) }
                        if (ok) inserted++ else errors.add("Failed to insert: ${s.name}")
                    }
                    vm.setSuppliersLocal(previewSuppliers)
                    uploadResult = UploadResult(inserted, previewSuppliers.size - inserted, errors, emptyList())
                    isProcessing = false
                    withContext(Dispatchers.Main) {
                        navController.navigate(Screen.VisualGlobe.route) {
                            popUpTo(Screen.DataUpload.route) { inclusive = false }
                        }
                    }
                }
            },
            modifier = Modifier.fillMaxWidth().height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
            enabled = previewSuppliers.isNotEmpty() && !isProcessing && uploadResult == null
        ) {
            if (isProcessing) {
                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("UPLOADING TO SUPABASE...", fontSize = 12.sp)
            } else {
                Icon(Icons.Default.CloudUpload, null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(if (uploadResult != null) "✓ UPLOAD COMPLETE" else "UPLOAD ${previewSuppliers.size} SUPPLIERS TO SUPABASE",
                    fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }

        DashboardSection("CSV FORMAT REQUIREMENTS") {
            listOf("Required: name, tier_level, lat, lng",
                "Optional: country, region, city, category, depends_on",
                "Scores: risk_score, health_score, quality_score, resilience_score",
                "Boolean: is_backup (true/false)"
            ).forEach { req ->
                Row(modifier = Modifier.padding(vertical = 3.dp)) {
                    Text("•", color = Color(0xFF3B82F6), fontSize = 12.sp, modifier = Modifier.width(16.dp))
                    Text(req, color = Color(0xFF94A3B8), fontSize = 11.sp)
                }
            }
        }
    }
}

// ── Excel Upload ──────────────────────────────────────────────────────────────
@Composable
fun ExcelUploadScreen(navController: NavController, vm: SupplierViewModel = hiltViewModel()) {
    var selectedUri by remember { mutableStateOf<Uri?>(null) }
    var uploadResult by remember { mutableStateOf<UploadResult?>(null) }
    var isProcessing by remember { mutableStateOf(false) }
    var previewSuppliers by remember { mutableStateOf<List<Supplier>>(emptyList()) }
    var parseErrors by remember { mutableStateOf<List<String>>(emptyList()) }

    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        uri?.let {
            selectedUri = it
            uploadResult = null
            scope.launch {
                isProcessing = true
                val (parsed, errors) = withContext(Dispatchers.IO) { parseExcelToSuppliers(context, it) }
                previewSuppliers = parsed
                parseErrors = errors
                isProcessing = false
            }
        }
    }

    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {

        Text("EXCEL UPLOAD", color = Color(0xFF3B82F6), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Import supply chain data from Excel files", color = Color(0xFF64748B), fontSize = 11.sp)

        Card(modifier = Modifier.fillMaxWidth().height(140.dp).clickable {
            launcher.launch("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        }, colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp,
                if (selectedUri != null) Color(0xFF3B82F6).copy(0.5f) else Color.White.copy(0.1f))) {
            Column(modifier = Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                Icon(if (selectedUri != null) Icons.Default.CheckCircle else Icons.Default.GridOn, null,
                    tint = if (selectedUri != null) Color(0xFF3B82F6) else Color(0xFF64748B), modifier = Modifier.size(38.dp))
                Spacer(modifier = Modifier.height(8.dp))
                Text(if (selectedUri != null) selectedUri!!.lastPathSegment ?: "File selected" else "Tap to select .xlsx file",
                    color = if (selectedUri != null) Color(0xFF3B82F6) else Color(0xFF64748B), fontSize = 12.sp)
                if (selectedUri == null) Text("Sheet 1 must contain header row with required columns",
                    color = Color(0xFF475569), fontSize = 10.sp)
            }
        }

        if (isProcessing) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                CircularProgressIndicator(color = Color(0xFF3B82F6), modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(12.dp))
                Text("Parsing Excel file...", color = Color(0xFF64748B), fontSize = 12.sp)
            }
        }

        if (parseErrors.isNotEmpty()) {
            DashboardSection("VALIDATION ISSUES (${parseErrors.size})") {
                parseErrors.take(5).forEach { err ->
                    Row(modifier = Modifier.padding(vertical = 3.dp)) {
                        Icon(Icons.Default.Warning, null, tint = Color(0xFFF59E0B), modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(err, color = Color(0xFFF59E0B), fontSize = 10.sp)
                    }
                }
            }
        }

        if (previewSuppliers.isNotEmpty()) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                KpiCard("Rows Parsed", previewSuppliers.size.toString(), Color(0xFF3B82F6), Modifier.weight(1f))
                KpiCard("Valid", (previewSuppliers.size - parseErrors.size).coerceAtLeast(0).toString(), Color(0xFF10B981), Modifier.weight(1f))
                KpiCard("Issues", parseErrors.size.toString(), if (parseErrors.isEmpty()) Color(0xFF10B981) else Color(0xFFF59E0B), Modifier.weight(1f))
            }

            DashboardSection("PREVIEW (first 5 rows)") {
                previewSuppliers.take(5).forEach { s ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Text(s.name, color = Color.White, fontSize = 11.sp, modifier = Modifier.weight(1f))
                        Text("T${s.tierLevel}", color = Color(0xFF3B82F6), fontSize = 10.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("${s.lat.format(2)}, ${s.lng.format(2)}", color = Color(0xFF64748B), fontSize = 10.sp)
                    }
                    Divider(color = Color.White.copy(0.04f))
                }
            }
        }

        uploadResult?.let { result ->
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF3B82F6).copy(0.1f)),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF3B82F6).copy(0.4f)),
                shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("✅ Upload Complete", color = Color(0xFF3B82F6), fontWeight = FontWeight.Bold)
                    Text("${result.inserted} suppliers inserted to Supabase", color = Color(0xFF94A3B8), fontSize = 12.sp)
                }
            }
        }

        Button(
            onClick = {
                scope.launch {
                    isProcessing = true
                    var inserted = 0
                    val errors = mutableListOf<String>()
                    
                    // Clear existing data before upload (Single Source of Truth)
                    withContext(Dispatchers.IO) { vm.deleteAllSuppliers() }

                    previewSuppliers.forEach { s ->
                        val ok = withContext(Dispatchers.IO) { vm.addSync(s) }
                        if (ok) inserted++ else errors.add("Failed: ${s.name}")
                    }
                    vm.setSuppliersLocal(previewSuppliers)
                    uploadResult = UploadResult(inserted, previewSuppliers.size - inserted, errors, emptyList())
                    isProcessing = false
                    withContext(Dispatchers.Main) {
                        navController.navigate(Screen.VisualGlobe.route) {
                            popUpTo(Screen.DataUpload.route) { inclusive = false }
                        }
                    }
                }
            },
            modifier = Modifier.fillMaxWidth().height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B82F6)),
            enabled = previewSuppliers.isNotEmpty() && !isProcessing && uploadResult == null
        ) {
            if (isProcessing) {
                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("UPLOADING...", fontSize = 12.sp)
            } else {
                Icon(Icons.Default.CloudUpload, null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(if (uploadResult != null) "✓ COMPLETE" else "UPLOAD ${previewSuppliers.size} SUPPLIERS", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

// ── Data Mapping ──────────────────────────────────────────────────────────────
@Composable
fun DataMappingScreen() {
    val scroll = rememberScrollState()
    val fields = listOf("name" to "Supplier Name", "tier_level" to "Tier", "lat" to "Latitude", "lng" to "Longitude",
        "health_score" to "Health %", "risk_score" to "Risk Score", "country" to "Country", "category" to "Category")

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("DATA MAPPING", color = Color(0xFFA855F7), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Configure column → field mappings for your CSV/Excel", color = Color(0xFF64748B), fontSize = 11.sp)
        DashboardSection("FIELD MAPPING CONFIGURATION") {
            fields.forEach { (dbField, displayName) ->
                var colName by remember { mutableStateOf(dbField) }
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text(displayName, color = Color(0xFF64748B), fontSize = 11.sp, modifier = Modifier.weight(1f))
                    Text("→", color = Color(0xFFA855F7), modifier = Modifier.padding(horizontal = 8.dp))
                    OutlinedTextField(value = colName, onValueChange = { colName = it },
                        modifier = Modifier.weight(1f).height(48.dp),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Color(0xFFA855F7),
                            unfocusedBorderColor = Color.White.copy(0.1f), focusedTextColor = Color.White, unfocusedTextColor = Color.White),
                        shape = RoundedCornerShape(8.dp))
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            Button(onClick = {}, modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFA855F7))) {
                Text("SAVE MAPPING", fontWeight = FontWeight.Bold)
            }
        }
    }
}

// ── Data Validation ───────────────────────────────────────────────────────────
@Composable
fun DataValidationScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = rememberScrollState()

    val missingCoords = suppliers.count { it.lat == 0.0 && it.lng == 0.0 }
    val missingCountry = suppliers.count { it.country.isNullOrBlank() }
    val highRisk = suppliers.count { it.riskScore > 90 }
    val lowHealth = suppliers.count { it.healthScore < 10 }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("DATA VALIDATION", color = Color(0xFFF59E0B), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Quality report for ${suppliers.size} loaded suppliers", color = Color(0xFF64748B), fontSize = 11.sp)

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("Total", suppliers.size.toString(), Color(0xFF3B82F6), Modifier.weight(1f))
            KpiCard("Valid", (suppliers.size - missingCoords).toString(), Color(0xFF10B981), Modifier.weight(1f))
        }

        DashboardSection("VALIDATION RESULTS") {
            listOf(
                Triple("Suppliers with coordinates", "${suppliers.size - missingCoords} / ${suppliers.size}", if (missingCoords == 0) Color(0xFF10B981) else Color(0xFFF59E0B)),
                Triple("Missing coordinates", missingCoords.toString(), if (missingCoords == 0) Color(0xFF10B981) else Color(0xFFEF4444)),
                Triple("Missing country", missingCountry.toString(), if (missingCountry == 0) Color(0xFF10B981) else Color(0xFFF59E0B)),
                Triple("Extreme risk (>90)", highRisk.toString(), if (highRisk == 0) Color(0xFF10B981) else Color(0xFFEF4444)),
                Triple("Critically low health (<10)", lowHealth.toString(), if (lowHealth == 0) Color(0xFF10B981) else Color(0xFFEF4444)),
            ).forEach { (label, value, color) ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                    Text(label, color = Color(0xFF64748B), fontSize = 11.sp, modifier = Modifier.weight(1f))
                    Text(value, color = color, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
                Divider(color = Color.White.copy(0.04f))
            }
        }
    }
}

// ── Templates ─────────────────────────────────────────────────────────────────
@Composable
fun DataTemplatesScreen() {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("UPLOAD TEMPLATES", color = Color(0xFF06B6D4), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Required column headers for your upload files", color = Color(0xFF64748B), fontSize = 11.sp)

        DashboardSection("REQUIRED CSV HEADER FORMAT") {
            Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth()) {
                Text("name,tier_level,lat,lng,country,region,city,category,risk_score,health_score,quality_score,resilience_score,is_backup,depends_on",
                    color = Color(0xFF10B981), fontSize = 9.sp, modifier = Modifier.padding(12.dp),
                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
            }
        }

        listOf("Supplier Master Template (.csv)", "Dependency Edges Template (.csv)",
            "Tier 1 Suppliers Template (.xlsx)", "Full Supply Chain Template (.xlsx)"
        ).forEach { template ->
            Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().clickable {}) {
                Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.FileCopy, null, tint = Color(0xFF06B6D4), modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(template, color = Color.White, fontSize = 12.sp, modifier = Modifier.weight(1f))
                    Icon(Icons.Default.Download, null, tint = Color(0xFF3B82F6), modifier = Modifier.size(18.dp))
                }
            }
        }
    }
}

// ── Upload Status ─────────────────────────────────────────────────────────────
@Composable
fun DataStatusScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("UPLOAD STATUS", color = Color(0xFF14B8A6), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("Loaded", suppliers.size.toString(), Color(0xFF10B981), Modifier.weight(1f))
            KpiCard("Tier 1", suppliers.count { it.tierLevel == 1 }.toString(), Color(0xFF3B82F6), Modifier.weight(1f))
            KpiCard("Backups", suppliers.count { it.isBackup }.toString(), Color(0xFFA855F7), Modifier.weight(1f))
        }

        if (suppliers.isEmpty()) {
            Card(colors = CardDefaults.cardColors(containerColor = Color(0xFFF59E0B).copy(0.1f)),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFF59E0B).copy(0.3f)),
                shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()) {
                Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Warning, null, tint = Color(0xFFF59E0B))
                    Spacer(modifier = Modifier.width(12.dp))
                    Text("No supplier data loaded. Use CSV or Excel upload to ingest your dataset.",
                        color = Color(0xFFF59E0B), fontSize = 12.sp)
                }
            }
        } else {
            DashboardSection("CURRENT DATASET") {
                suppliers.take(10).forEach { s ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp)) {
                        Text(s.name, color = Color.White, fontSize = 11.sp, modifier = Modifier.weight(1f))
                        Text("T${s.tierLevel}", color = Color(0xFF3B82F6), fontSize = 10.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("${s.healthScore.toInt()}%", color = if (s.healthScore > 70) Color(0xFF10B981) else Color(0xFFEF4444), fontSize = 10.sp)
                    }
                }
                if (suppliers.size > 10) Text("... +${suppliers.size - 10} more", color = Color(0xFF64748B), fontSize = 10.sp)
            }
        }
    }
}

private fun Double.format(d: Int) = "%.${d}f".format(this)
