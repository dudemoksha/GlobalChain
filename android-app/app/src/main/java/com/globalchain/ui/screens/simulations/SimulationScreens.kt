@file:OptIn(ExperimentalMaterial3Api::class)
package com.globalchain.ui.screens.simulations

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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.globalchain.data.models.SimulationConfig
import com.globalchain.ui.screens.dashboard.DashboardSection
import com.globalchain.ui.screens.dashboard.EmptyDataPlaceholder
import com.globalchain.ui.screens.dashboard.KpiCard
import com.globalchain.ui.viewmodel.SimulationViewModel
import com.globalchain.ui.viewmodel.SupplierViewModel
import com.globalchain.ui.screens.visualization.GlobeWebView

private val SCENARIOS = listOf(
    Triple("Disaster", "Natural Disaster", Color(0xFF3B82F6)),
    Triple("Earthquake", "Earthquake", Color(0xFFF59E0B)),
    Triple("Flood", "Flood Event", Color(0xFF06B6D4)),
    Triple("Cyber", "Cyberattack", Color(0xFFEF4444)),
    Triple("War", "Geopolitical Conflict", Color(0xFFA855F7)),
    Triple("Port", "Port Shutdown", Color(0xFF14B8A6)),
    Triple("Traffic", "Traffic Disruption", Color(0xFFFF6B35)),
    Triple("Industrial", "Industrial Accident", Color(0xFFE97316)),
    Triple("Geopolitical", "Geopolitical Conflict", Color(0xFF8B5CF6)),
    Triple("Logistics", "Logistics Breakdown", Color(0xFF06B6D4))
)

@Composable
fun SimulationCenterScreen(
    simVm: SimulationViewModel = hiltViewModel(),
    supplierVm: SupplierViewModel = hiltViewModel()
) {
    val suppliers by supplierVm.suppliers.collectAsState()
    val config by simVm.config.collectAsState()
    val result by simVm.result.collectAsState()
    val running by simVm.running.collectAsState()
    val scroll = rememberScrollState()

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {

        // Header
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Column {
                Text("STRESS SIMULATION LAB", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Text("High-fidelity supply chain stress testing", color = Color(0xFF64748B), fontSize = 11.sp)
            }
            if (result != null) {
                IconButton(onClick = { simVm.clearSimulation() }) {
                    Icon(Icons.Default.Refresh, null, tint = Color(0xFFEF4444))
                }
            }
        }

        // ── Temporary Simulation Globe (Req 34/35) ──
        Box(modifier = Modifier.fillMaxWidth().height(300.dp).background(Color.Black, RoundedCornerShape(12.dp))) {
            if (result != null) {
                GlobeWebView(suppliers = result!!.simulatedSuppliers)
            } else {
                GlobeWebView(suppliers = suppliers)
            }
            // Overlay gradient
            Box(modifier = Modifier.fillMaxSize().background(
                androidx.compose.ui.graphics.Brush.verticalGradient(
                    colors = listOf(Color.Transparent, Color(0xFF020617)),
                    startY = 400f
                )
            ))
            Text(if (result != null) "SIMULATION ACTIVE" else "ORIGINAL NETWORK", color = if (result != null) Color(0xFFEF4444) else Color(0xFF10B981), fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.align(Alignment.TopEnd).padding(12.dp).background(Color(0xFF0F172A).copy(0.8f), RoundedCornerShape(4.dp)).padding(horizontal = 8.dp, vertical = 4.dp))
        }

        // Scenario Selector
        DashboardSection("SELECT SCENARIO") {
            val chunked = SCENARIOS.chunked(4)
            chunked.forEach { row ->
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                    row.forEach { (id, label, color) ->
                        val selected = config.type == id
                        Card(
                            modifier = Modifier.weight(1f).clickable {
                                simVm.updateConfig(config.copy(type = id))
                            },
                            colors = CardDefaults.cardColors(
                                containerColor = if (selected) color.copy(alpha = 0.2f) else Color.White.copy(alpha = 0.03f)
                            ),
                            border = androidx.compose.foundation.BorderStroke(1.dp, if (selected) color else Color.White.copy(0.08f)),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Column(modifier = Modifier.padding(8.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(label.split(" ").first(), color = if (selected) color else Color.Gray,
                                    fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(6.dp))
            }
        }

        // Config Controls
        DashboardSection("PARAMETERS") {
            // Severity
            Text("SEVERITY LEVEL", color = Color(0xFF64748B), fontSize = 9.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("Low", "Medium", "High", "Critical").forEach { level ->
                    val selected = config.severity == level
                    val color = when(level) { "Critical" -> Color(0xFFEF4444); "High" -> Color(0xFFF59E0B); "Medium" -> Color(0xFF3B82F6); else -> Color(0xFF10B981) }
                    FilterChip(selected = selected, onClick = { simVm.updateConfig(config.copy(severity = level)) },
                        label = { Text(level, fontSize = 10.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = color, selectedLabelColor = Color.White))
                }
            }
            Spacer(modifier = Modifier.height(12.dp))

            // Duration
            Text("PROJECTED DURATION", color = Color(0xFF64748B), fontSize = 9.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("1 Week", "1 Month", "3 Months", "6 Months").forEach { dur ->
                    FilterChip(selected = config.duration == dur, onClick = { simVm.updateConfig(config.copy(duration = dur)) },
                        label = { Text(dur, fontSize = 10.sp) },
                        colors = FilterChipDefaults.filterChipColors(selectedContainerColor = Color(0xFF3B82F6), selectedLabelColor = Color.White))
                }
            }
            Spacer(modifier = Modifier.height(12.dp))

            // Dropdown / City Selection (Req 34 Step 4)
            var expanded by remember { mutableStateOf(false) }
            val uniqueCountries = suppliers.mapNotNull { it.country }.distinct().sorted()
            if (uniqueCountries.isNotEmpty()) {
                Text("AFFECTED REGION", color = Color(0xFF64748B), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = !expanded }) {
                    OutlinedTextField(
                        value = config.locationName,
                        onValueChange = {},
                        readOnly = true,
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                        modifier = Modifier.menuAnchor().fillMaxWidth(),
                        colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        )
                    )
                    ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                        uniqueCountries.forEach { c ->
                            DropdownMenuItem(text = { Text(c, color = Color.Black) }, onClick = {
                                val s = suppliers.firstOrNull { it.country == c }
                                if (s != null) {
                                    simVm.updateConfig(config.copy(locationName = c, lat = s.lat, lng = s.lng))
                                }
                                expanded = false
                            })
                        }
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
            }

            // Radius Slider
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("IMPACT RADIUS", color = Color(0xFF64748B), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                Text("${config.radius} km", color = Color(0xFF3B82F6), fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }
            Slider(value = config.radius.toFloat(), onValueChange = { simVm.updateConfig(config.copy(radius = it.toInt())) },
                valueRange = 100f..5000f, colors = SliderDefaults.colors(thumbColor = Color(0xFF3B82F6), activeTrackColor = Color(0xFF3B82F6)))
        }

        // Run Button
        Button(onClick = { simVm.runSimulation(suppliers) },
            modifier = Modifier.fillMaxWidth().height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B82F6)),
            enabled = !running) {
            if (running) {
                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(12.dp))
                Text("CALCULATING PROPAGATION...", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            } else {
                Icon(Icons.Default.PlayArrow, null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("INITIALIZE STRESS TEST", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }

        // Results
        result?.let { res ->
            DashboardSection("IMPACT REPORT") {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    KpiCard("Nodes Hit", res.totalAffected.toString(), Color(0xFFEF4444), Modifier.weight(1f))
                    KpiCard("Resilience", "${res.resilienceScore}%", Color(0xFF3B82F6), Modifier.weight(1f))
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    KpiCard("Financial Loss", "$${String.format("%.1f", res.financialLoss / 1_000_000)}M", Color(0xFFF59E0B), Modifier.weight(1f))
                    KpiCard("Delay", res.logisticsDelay, Color(0xFF06B6D4), Modifier.weight(1f))
                }
            }

            // Affected Suppliers
            if (res.affectedSuppliers.isNotEmpty()) {
                DashboardSection("DISRUPTED NODES (${res.affectedSuppliers.size})") {
                    res.affectedSuppliers.sortedBy { it.health }.take(8).forEach { s ->
                        val c = if (s.health < 40) Color(0xFFEF4444) else Color(0xFFF59E0B)
                        Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Warning, null, tint = c, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(s.name, color = Color.White, fontSize = 11.sp)
                                Text(s.reason.take(60) + "...", color = Color(0xFF64748B), fontSize = 9.sp)
                            }
                            Text("${s.health}%", color = c, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                        Divider(color = Color.White.copy(0.03f))
                    }
                }
            }

            // Recommendations
            if (res.recommendations.isNotEmpty()) {
                DashboardSection("AI MITIGATION VECTORS") {
                    res.recommendations.forEachIndexed { i, rec ->
                        Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF3B82F6).copy(0.05f)),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF3B82F6).copy(0.2f)),
                            shape = RoundedCornerShape(10.dp), modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text("Vector_0${i + 1}: ${rec.backupName}", color = Color(0xFF3B82F6), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                Text(rec.reason, color = Color(0xFF94A3B8), fontSize = 10.sp, modifier = Modifier.padding(vertical = 4.dp))
                                Row {
                                    Text("Risk ↓${rec.riskReduction}%", color = Color(0xFF10B981), fontSize = 10.sp, modifier = Modifier.weight(1f))
                                    Text("Logistics +${rec.logisticsImprovement}%", color = Color(0xFF3B82F6), fontSize = 10.sp)
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                Text("📧 ${rec.email}", color = Color(0xFF64748B), fontSize = 10.sp)
                                Text("📞 ${rec.phone}", color = Color(0xFF64748B), fontSize = 10.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun SimulationConfigScreen(type: String, simVm: SimulationViewModel = hiltViewModel(), supplierVm: SupplierViewModel = hiltViewModel()) {
    val suppliers by supplierVm.suppliers.collectAsState()
    val config by simVm.config.collectAsState()
    val result by simVm.result.collectAsState()
    val running by simVm.running.collectAsState()

    LaunchedEffect(type) { simVm.updateConfig(config.copy(type = type)) }

    val scenarioInfo = SCENARIOS.find { it.first == type }
    val color = scenarioInfo?.third ?: Color(0xFF3B82F6)
    val scroll = rememberScrollState()

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("$type SIMULATION", color = color, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text(scenarioInfo?.second ?: type, color = Color(0xFF64748B), fontSize = 11.sp)

        DashboardSection("CONFIGURE & LAUNCH") {
            Text("SEVERITY", color = Color(0xFF64748B), fontSize = 9.sp, fontWeight = FontWeight.Bold)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 8.dp, bottom = 12.dp)) {
                listOf("Low","Medium","High","Critical").forEach { sev ->
                    FilterChip(selected = config.severity == sev, onClick = { simVm.updateConfig(config.copy(severity = sev)) },
                        label = { Text(sev, fontSize = 10.sp) },
                        colors = FilterChipDefaults.filterChipColors(selectedContainerColor = color, selectedLabelColor = Color.White))
                }
            }
            Button(onClick = { simVm.runSimulation(suppliers) }, modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = color), enabled = !running) {
                if (running) CircularProgressIndicator(color = Color.White, modifier = Modifier.size(18.dp))
                else Text("RUN $type SIMULATION", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }

        result?.let { res ->
            DashboardSection("RESULTS") {
                listOf("Nodes Affected" to res.totalAffected.toString(), "Resilience" to "${res.resilienceScore}%",
                    "Financial Exposure" to "$${String.format("%.1f", res.financialLoss / 1_000_000)}M",
                    "Logistics Delay" to res.logisticsDelay).forEach { (k, v) ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp)) {
                        Text(k, color = Color(0xFF64748B), fontSize = 11.sp, modifier = Modifier.weight(1f))
                        Text(v, color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                    Divider(color = Color.White.copy(0.04f))
                }
            }
        }
    }
}

@Composable
fun SimulationHistoryScreen(simVm: SimulationViewModel = hiltViewModel()) {
    val history by simVm.history.collectAsState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp)) {
        Text("SIMULATION VAULT", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("${history.size} historical scenarios", color = Color(0xFF64748B), fontSize = 11.sp)
        Spacer(modifier = Modifier.height(16.dp))
        if (history.isEmpty()) EmptyDataPlaceholder("No simulations run yet. Go to Simulation Center.")
        else LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(history) { res ->
                Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(0.05f)),
                    modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(res.config.type, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            val sevColor = when(res.config.severity) { "Critical" -> Color(0xFFEF4444); "High" -> Color(0xFFF59E0B); else -> Color(0xFF3B82F6) }
                            Text(res.config.severity, color = sevColor, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                            Text("${res.totalAffected} nodes", color = Color(0xFFEF4444), fontSize = 10.sp)
                            Text("$${String.format("%.1f", res.financialLoss / 1_000_000)}M loss", color = Color(0xFFF59E0B), fontSize = 10.sp)
                            Text("${res.resilienceScore}% resilience", color = Color(0xFF3B82F6), fontSize = 10.sp)
                        }
                    }
                }
            }
        }
    }
}
