package com.globalchain.ui.screens.suppliers

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.globalchain.data.models.Supplier
import com.globalchain.navigation.Screen
import androidx.compose.ui.graphics.nativeCanvas
import com.globalchain.ui.screens.dashboard.EmptyDataPlaceholder
import com.globalchain.ui.screens.dashboard.KpiCard
import com.globalchain.ui.viewmodel.SupplierViewModel

@Composable
fun SuppliersScreen(navController: NavController, vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val loading by vm.loading.collectAsState()
    var search by remember { mutableStateOf("") }
    var selectedTab by remember { mutableIntStateOf(0) }

    val tabs = listOf("All", "Tier 1", "Tier 2", "Tier 3", "Backups")
    val filtered = suppliers.filter {
        (search.isEmpty() || it.name.contains(search, ignoreCase = true)) &&
        when (selectedTab) {
            1 -> it.tierLevel == 1 && !it.isBackup
            2 -> it.tierLevel == 2 && !it.isBackup
            3 -> it.tierLevel == 3 && !it.isBackup
            4 -> it.isBackup
            else -> true
        }
    }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617))) {
        // Header
        Row(modifier = Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Column {
                Text("SUPPLIER ECOSYSTEM", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                Text("${suppliers.size} nodes tracked", color = Color(0xFF64748B), fontSize = 10.sp)
            }
            FloatingActionButton(
                onClick = { navController.navigate(Screen.AddSupplier.route) },
                containerColor = Color(0xFF3B82F6), contentColor = Color.White,
                modifier = Modifier.size(44.dp)
            ) { Icon(Icons.Default.Add, null, modifier = Modifier.size(20.dp)) }
        }

        // KPIs
        Row(modifier = Modifier.padding(horizontal = 16.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("Total", suppliers.size.toString(), Color(0xFF3B82F6), Modifier.weight(1f))
            KpiCard("High Risk", suppliers.count { it.riskScore > 70 }.toString(), Color(0xFFEF4444), Modifier.weight(1f))
            KpiCard("Backups", suppliers.count { it.isBackup }.toString(), Color(0xFFA855F7), Modifier.weight(1f))
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Search
        OutlinedTextField(
            value = search, onValueChange = { search = it },
            placeholder = { Text("Search suppliers...", fontSize = 12.sp) },
            leadingIcon = { Icon(Icons.Default.Search, null, tint = Color(0xFF64748B)) },
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Color(0xFF3B82F6),
                unfocusedBorderColor = Color.White.copy(0.1f), focusedTextColor = Color.White, unfocusedTextColor = Color.White),
            shape = RoundedCornerShape(12.dp)
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Tabs
        ScrollableTabRow(selectedTabIndex = selectedTab, containerColor = Color.Transparent, contentColor = Color(0xFF3B82F6),
            edgePadding = 16.dp, divider = {}) {
            tabs.forEachIndexed { i, tab ->
                Tab(selected = selectedTab == i, onClick = { selectedTab = i },
                    text = { Text(tab, fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                    selectedContentColor = Color(0xFF3B82F6), unselectedContentColor = Color.Gray)
            }
        }

        if (loading) { LinearProgressIndicator(modifier = Modifier.fillMaxWidth(), color = Color(0xFF3B82F6)) }

        // Supplier List
        LazyColumn(modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
            contentPadding = PaddingValues(vertical = 8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            if (filtered.isEmpty()) {
                item { EmptyDataPlaceholder(if (search.isNotEmpty()) "No suppliers match search." else "No suppliers in this tier.") }
            }
            items(filtered) { supplier ->
                SupplierRow(supplier) { navController.navigate("supplier_details/${supplier.id}") }
            }
        }
    }
}

@Composable
fun SupplierRow(supplier: Supplier, onClick: () -> Unit) {
    val healthColor = when {
        supplier.healthScore < 40 -> Color(0xFFEF4444)
        supplier.healthScore < 70 -> Color(0xFFF59E0B)
        else -> Color(0xFF10B981)
    }
    Card(
        modifier = Modifier.fillMaxWidth().clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(0.05f))
    ) {
        Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier.size(42.dp).background(Color(0xFF3B82F6).copy(0.1f), RoundedCornerShape(10.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Business, null, tint = Color(0xFF3B82F6), modifier = Modifier.size(20.dp))
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(supplier.name, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Text("Tier ${supplier.tierLevel} • ${supplier.country ?: supplier.region ?: "Unknown"}",
                    color = Color(0xFF64748B), fontSize = 10.sp)
            }
            Column(horizontalAlignment = Alignment.End) {
                Text("${supplier.healthScore.toInt()}%", color = healthColor, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Text("Health", color = Color(0xFF64748B), fontSize = 9.sp)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SupplierDetailsScreen(navController: NavController, supplierId: String = "", vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val supplier = suppliers.find { it.id == supplierId } ?: suppliers.firstOrNull() ?: return

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(Icons.Default.ArrowBack, null, tint = Color.White)
            }
            Text("SUPPLIER DETAILS", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }
        Spacer(modifier = Modifier.height(16.dp))

        Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(16.dp)) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(supplier.name, color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Text("Tier ${supplier.tierLevel}", color = Color(0xFF3B82F6), fontSize = 12.sp)
                Spacer(modifier = Modifier.height(16.dp))

                listOf(
                    "Health Score" to "${supplier.healthScore.toInt()}%",
                    "Risk Score" to "${supplier.riskScore.toInt()}",
                    "Quality Score" to "${supplier.qualityScore.toInt()}%",
                    "Resilience" to "${supplier.resilienceScore.toInt()}%",
                    "Category" to (supplier.category ?: "N/A"),
                    "Region" to (supplier.region ?: "N/A"),
                    "Country" to (supplier.country ?: "N/A"),
                    "Coordinates" to "Lat: ${supplier.lat.format(2)}, Lng: ${supplier.lng.format(2)}"
                ).forEach { (label, value) ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                        Text(label, color = Color(0xFF64748B), fontSize = 11.sp, modifier = Modifier.weight(1f))
                        Text(value, color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                    Divider(color = Color.White.copy(0.05f))
                }

                Spacer(modifier = Modifier.height(20.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Button(onClick = { navController.navigate("supplier_edit/${supplier.id}") },
                        modifier = Modifier.weight(1f), colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B82F6))) {
                        Icon(Icons.Default.Edit, null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Edit", fontSize = 12.sp)
                    }
                    Button(onClick = { vm.delete(supplier.id); navController.popBackStack() },
                        modifier = Modifier.weight(1f), colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444))) {
                        Icon(Icons.Default.Delete, null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Delete", fontSize = 12.sp)
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditSupplierScreen(navController: NavController, isEdit: Boolean, supplierId: String = "", vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val existingSupplier = if (isEdit) suppliers.find { it.id == supplierId } else null
    var name by remember { mutableStateOf(existingSupplier?.name ?: "") }
    var tier by remember { mutableIntStateOf(existingSupplier?.tierLevel ?: 1) }
    var category by remember { mutableStateOf(existingSupplier?.category ?: "") }
    var country by remember { mutableStateOf(existingSupplier?.country ?: "") }
    var lat by remember { mutableStateOf(existingSupplier?.lat?.toString() ?: "") }
    var lng by remember { mutableStateOf(existingSupplier?.lng?.toString() ?: "") }
    var isBackup by remember { mutableStateOf(existingSupplier?.isBackup ?: false) }
    var saving by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, null, tint = Color.White) }
            Text(if (isEdit) "EDIT SUPPLIER" else "ADD SUPPLIER", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }
        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            item {
                SupplierFormField("Supplier Name", name, { name = it })
                Spacer(modifier = Modifier.height(4.dp))
                SupplierFormField("Category", category, { category = it })
                Spacer(modifier = Modifier.height(4.dp))
                SupplierFormField("Country", country, { country = it })
                Spacer(modifier = Modifier.height(4.dp))
                SupplierFormField("Latitude", lat, { lat = it }, KeyboardType.Decimal)
                Spacer(modifier = Modifier.height(4.dp))
                SupplierFormField("Longitude", lng, { lng = it }, KeyboardType.Decimal)
                Spacer(modifier = Modifier.height(8.dp))

                Text("TIER LEVEL", color = Color(0xFF64748B), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 8.dp)) {
                    listOf(1, 2, 3).forEach { t ->
                        FilterChip(selected = tier == t, onClick = { tier = t }, label = { Text("Tier $t", fontSize = 11.sp) },
                            colors = FilterChipDefaults.filterChipColors(selectedContainerColor = Color(0xFF3B82F6),
                                selectedLabelColor = Color.White))
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Switch(checked = isBackup, onCheckedChange = { isBackup = it },
                        colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = Color(0xFF3B82F6)))
                    Spacer(modifier = Modifier.width(12.dp))
                    Text("Mark as Backup Supplier", color = Color.White, fontSize = 12.sp)
                }
                Spacer(modifier = Modifier.height(24.dp))

                Button(onClick = {
                    saving = true
                    val newSupplier = Supplier(
                        id = if (isEdit) "existing-id" else "new-${System.currentTimeMillis()}",
                        name = name, tierLevel = tier, category = category,
                        country = country, lat = lat.toDoubleOrNull() ?: 0.0,
                        lng = lng.toDoubleOrNull() ?: 0.0, isBackup = isBackup
                    )
                    if (isEdit) vm.update(newSupplier) else vm.add(newSupplier)
                    navController.popBackStack()
                }, modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B82F6)),
                    enabled = name.isNotEmpty() && !saving) {
                    Text(if (isEdit) "SAVE CHANGES" else "ADD SUPPLIER")
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SupplierFormField(label: String, value: String, onChange: (String) -> Unit,
    keyboardType: KeyboardType = KeyboardType.Text) {
    OutlinedTextField(
        value = value, onValueChange = onChange, label = { Text(label, fontSize = 12.sp) },
        modifier = Modifier.fillMaxWidth(),
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Color(0xFF3B82F6),
            unfocusedBorderColor = Color.White.copy(0.1f), focusedTextColor = Color.White, unfocusedTextColor = Color.White),
        shape = RoundedCornerShape(12.dp)
    )
}

@Composable
fun BackupSuppliersScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val backups = suppliers.filter { it.isBackup }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp)) {
        Text("BACKUP SUPPLIERS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("${backups.size} emergency backup nodes", color = Color(0xFF64748B), fontSize = 11.sp)
        Spacer(modifier = Modifier.height(16.dp))

        if (backups.isEmpty()) EmptyDataPlaceholder("No backup suppliers defined. Add backups via Add Supplier.")
        else LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(backups) { SupplierRow(it) {} }
        }
    }
}

@Composable
fun TierSuppliersScreen(tier: Int, vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val tierSuppliers = suppliers.filter { it.tierLevel == tier && !it.isBackup }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp)) {
        Text("TIER $tier SUPPLIERS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("${tierSuppliers.size} tier $tier nodes", color = Color(0xFF64748B), fontSize = 11.sp)
        Spacer(modifier = Modifier.height(16.dp))

        if (tierSuppliers.isEmpty()) EmptyDataPlaceholder("No Tier $tier suppliers. Upload a dataset.")
        else LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(tierSuppliers) { SupplierRow(it) {} }
        }
    }
}

@Composable
fun SupplierHealthScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = androidx.compose.foundation.rememberScrollState()

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp)
        .verticalScroll(scroll)) {
        Text("SUPPLIER HEALTH", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(16.dp))

        suppliers.sortedBy { it.healthScore }.take(20).forEach { s ->
            val color = when {
                s.healthScore < 40 -> Color(0xFFEF4444)
                s.healthScore < 70 -> Color(0xFFF59E0B)
                else -> Color(0xFF10B981)
            }
            Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(s.name, color = Color.White, fontSize = 11.sp, modifier = Modifier.weight(1f))
                LinearProgressIndicator(progress = (s.healthScore / 100).toFloat(),
                    modifier = Modifier.width(80.dp).height(4.dp), color = color, trackColor = Color.White.copy(0.1f))
                Spacer(modifier = Modifier.width(8.dp))
                Text("${s.healthScore.toInt()}%", color = color, fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun SupplierContractsScreen() {
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp)) {
        Text("SUPPLIER CONTRACTS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(16.dp))
        EmptyDataPlaceholder("Contract management module — integrate with your contract database.")
    }
}

@Composable
fun DependencyMappingScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = androidx.compose.foundation.rememberScrollState()
    
    // Group by tier for drawing
    val tier1 = suppliers.filter { it.tierLevel == 1 }
    val tier2 = suppliers.filter { it.tierLevel == 2 }
    val tier3 = suppliers.filter { it.tierLevel == 3 }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp)) {
        Text("DEPENDENCY MAPPING", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Supply chain node dependency graph", color = Color(0xFF64748B), fontSize = 11.sp)
        Spacer(modifier = Modifier.height(16.dp))

        if (suppliers.isEmpty()) {
            EmptyDataPlaceholder("Upload a dataset to visualize supplier dependencies.")
        } else {
            // Visual Graph using Canvas
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(500.dp)
                    .background(Color(0xFF0F172A), RoundedCornerShape(16.dp))
                    .padding(16.dp)
            ) {
                androidx.compose.foundation.Canvas(modifier = Modifier.fillMaxSize()) {
                    val w = size.width
                    val h = size.height
                    
                    val myCompanyPos = androidx.compose.ui.geometry.Offset(w / 2, 40f)
                    val rowSpacing = (h - 80f) / 3f

                    // Function to calculate node positions
                    fun getPositions(count: Int, yPos: Float): List<androidx.compose.ui.geometry.Offset> {
                        if (count == 0) return emptyList()
                        val spacing = w / (count + 1)
                        return (1..count).map { i ->
                            androidx.compose.ui.geometry.Offset(i * spacing, yPos)
                        }
                    }

                    val t1Pos = getPositions(minOf(tier1.size, 6), myCompanyPos.y + rowSpacing)
                    val t2Pos = getPositions(minOf(tier2.size, 8), myCompanyPos.y + rowSpacing * 2)
                    val t3Pos = getPositions(minOf(tier3.size, 10), myCompanyPos.y + rowSpacing * 3)

                    // Draw edges T1 -> MyCompany
                    t1Pos.forEach { pos ->
                        drawLine(color = Color(0xFF3B82F6).copy(alpha = 0.5f), start = pos, end = myCompanyPos, strokeWidth = 2f)
                    }
                    
                    // Draw edges T2 -> T1
                    t2Pos.forEachIndexed { i, pos ->
                        val target = t1Pos.getOrNull(i % maxOf(t1Pos.size, 1)) ?: myCompanyPos
                        drawLine(color = Color(0xFF10B981).copy(alpha = 0.4f), start = pos, end = target, strokeWidth = 2f)
                    }

                    // Draw edges T3 -> T2
                    t3Pos.forEachIndexed { i, pos ->
                        val target = t2Pos.getOrNull(i % maxOf(t2Pos.size, 1)) ?: myCompanyPos
                        drawLine(color = Color(0xFFF59E0B).copy(alpha = 0.3f), start = pos, end = target, strokeWidth = 2f)
                    }

                    // Draw MyCompany Node
                    drawCircle(color = Color(0xFF3B82F6), radius = 24f, center = myCompanyPos)
                    drawContext.canvas.nativeCanvas.drawText("You", myCompanyPos.x - 20f, myCompanyPos.y + 40f, android.graphics.Paint().apply {
                        color = android.graphics.Color.WHITE
                        textSize = 24f
                    })

                    // Draw Tier Nodes
                    fun drawTierNodes(positions: List<androidx.compose.ui.geometry.Offset>, color: Color, nodes: List<Supplier>) {
                        positions.forEachIndexed { index, pos ->
                            val s = nodes[index]
                            val nodeColor = if (s.healthScore < 40) Color(0xFFEF4444) else color
                            drawCircle(color = nodeColor, radius = 16f, center = pos)
                            // Truncate name
                            val name = if (s.name.length > 8) s.name.take(6) + ".." else s.name
                            drawContext.canvas.nativeCanvas.drawText(name, pos.x - 24f, pos.y + 30f, android.graphics.Paint().apply {
                                this.color = android.graphics.Color.LTGRAY
                                textSize = 18f
                            })
                        }
                    }

                    drawTierNodes(t1Pos, Color(0xFF3B82F6), tier1)
                    drawTierNodes(t2Pos, Color(0xFF10B981), tier2)
                    drawTierNodes(t3Pos, Color(0xFFF59E0B), tier3)
                }
                
                // Legend
                Column(modifier = Modifier.align(Alignment.BottomStart)) {
                    Text("Legend", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(8.dp).background(Color(0xFF3B82F6), RoundedCornerShape(4.dp)))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Tier 1", color = Color(0xFF64748B), fontSize = 9.sp)
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(8.dp).background(Color(0xFF10B981), RoundedCornerShape(4.dp)))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Tier 2", color = Color(0xFF64748B), fontSize = 9.sp)
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(8.dp).background(Color(0xFFEF4444), RoundedCornerShape(4.dp)))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("High Risk", color = Color(0xFF64748B), fontSize = 9.sp)
                    }
                }
            }
        }
    }
}

private fun Double.format(decimals: Int) = "%.${decimals}f".format(this)
