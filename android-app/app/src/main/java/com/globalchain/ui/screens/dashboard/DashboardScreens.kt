package com.globalchain.ui.screens.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import com.globalchain.ui.viewmodel.SupplierViewModel

@Composable
fun ExecutiveDashboardScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val loading by vm.loading.collectAsState()
    val scroll = rememberScrollState()

    Column(
        modifier = Modifier.fillMaxSize().background(Color(0xFF020617))
            .padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("EXECUTIVE DASHBOARD", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Real-time supply chain command overview", color = Color(0xFF64748B), fontSize = 11.sp)

        if (loading) { CircularProgressIndicator(color = Color(0xFF3B82F6), modifier = Modifier.align(Alignment.CenterHorizontally)) }

        // KPI Row
        val kpis = listOf(
            Triple("Total Suppliers", suppliers.size.toString(), Color(0xFF3B82F6)),
            Triple("Avg Health", if (suppliers.isEmpty()) "N/A" else "${suppliers.map { it.healthScore }.average().toInt()}%", Color(0xFF10B981)),
            Triple("High Risk", suppliers.count { it.riskScore > 70 }.toString(), Color(0xFFEF4444)),
            Triple("Backups", suppliers.count { it.isBackup }.toString(), Color(0xFFA855F7))
        )
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            kpis.take(2).forEach { (label, value, color) ->
                KpiCard(label, value, color, Modifier.weight(1f))
            }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            kpis.drop(2).forEach { (label, value, color) ->
                KpiCard(label, value, color, Modifier.weight(1f))
            }
        }

        // Supplier Health Distribution
        DashboardSection("HEALTH DISTRIBUTION") {
            if (suppliers.isEmpty()) {
                EmptyDataPlaceholder("No supplier data. Upload a dataset.")
            } else {
                val critical = suppliers.count { it.healthScore < 40 }
                val warning = suppliers.count { it.healthScore in 40.0..70.0 }
                val healthy = suppliers.count { it.healthScore > 70 }

                listOf(
                    Triple("Critical", critical, Color(0xFFEF4444)),
                    Triple("Warning", warning, Color(0xFFF59E0B)),
                    Triple("Healthy", healthy, Color(0xFF10B981))
                ).forEach { (label, count, color) ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(10.dp).background(color, RoundedCornerShape(2.dp)))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(label, color = Color.Gray, fontSize = 11.sp, modifier = Modifier.weight(1f))
                        Text("$count suppliers", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Tier Breakdown
        DashboardSection("TIER BREAKDOWN") {
            listOf(1, 2, 3).forEach { tier ->
                val tierCount = suppliers.count { it.tierLevel == tier }
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically) {
                    Text("Tier $tier", color = Color(0xFF3B82F6), fontSize = 11.sp, modifier = Modifier.weight(1f))
                    Text("$tierCount nodes", color = Color.White, fontSize = 11.sp)
                }
            }
        }
    }
}

@Composable
fun GlobalDashboardScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = rememberScrollState()

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("GLOBAL OVERVIEW", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Worldwide supply chain intelligence", color = Color(0xFF64748B), fontSize = 11.sp)

        DashboardSection("REGIONAL DISTRIBUTION") {
            if (suppliers.isEmpty()) EmptyDataPlaceholder("No data available")
            else {
                val regions = suppliers.groupBy { it.region ?: "Unknown" }
                regions.entries.take(8).forEach { (region, list) ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp)) {
                        Icon(Icons.Default.Place, null, tint = Color(0xFF3B82F6), modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(region, color = Color.Gray, fontSize = 11.sp, modifier = Modifier.weight(1f))
                        Text("${list.size}", color = Color.White, fontSize = 11.sp)
                    }
                }
            }
        }

        DashboardSection("COUNTRY CONCENTRATION") {
            if (suppliers.isEmpty()) EmptyDataPlaceholder("No data available")
            else {
                val countries = suppliers.groupBy { it.country ?: "Unknown" }.entries
                    .sortedByDescending { it.value.size }.take(5)
                countries.forEach { (country, list) ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp)) {
                        Text(country, color = Color.Gray, fontSize = 11.sp, modifier = Modifier.weight(1f))
                        val pct = (list.size.toFloat() / suppliers.size * 100).toInt()
                        LinearProgressIndicator(
                            progress = pct / 100f,
                            modifier = Modifier.width(80.dp).height(4.dp),
                            color = Color(0xFF3B82F6), trackColor = Color.White.copy(0.1f)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("$pct%", color = Color.White, fontSize = 10.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun OperationalDashboardScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = rememberScrollState()

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("OPERATIONAL DASHBOARD", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("Operational", suppliers.count { it.healthScore >= 70 }.toString(), Color(0xFF10B981), Modifier.weight(1f))
            KpiCard("At Risk", suppliers.count { it.healthScore < 70 && it.healthScore >= 40 }.toString(), Color(0xFFF59E0B), Modifier.weight(1f))
        }

        DashboardSection("QUALITY SCORES BY CATEGORY") {
            if (suppliers.isEmpty()) EmptyDataPlaceholder("No data available")
            else {
                val categories = suppliers.groupBy { it.category ?: "Unknown" }
                categories.entries.take(5).forEach { (cat, list) ->
                    val score = list.map { it.qualityScore }.average()
                    val safeScore = if (score.isNaN()) 0.0 else score
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(cat, color = Color.Gray, fontSize = 11.sp, modifier = Modifier.weight(1f))
                        LinearProgressIndicator(progress = (safeScore / 100f).toFloat(), modifier = Modifier.width(80.dp).height(4.dp),
                            color = Color(0xFF10B981), trackColor = Color.White.copy(0.1f))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("${safeScore.toInt()}%", color = Color.White, fontSize = 10.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun HealthDashboardScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = rememberScrollState()

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("SUPPLIER HEALTH COMMAND", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)

        DashboardSection("HEALTH METRICS") {
            listOf("Health Score" to suppliers.map { it.healthScore }.average(),
                "Quality Score" to suppliers.map { it.qualityScore }.average(),
                "Resilience Score" to suppliers.map { it.resilienceScore }.average()
            ).forEach { (label, score) ->
                val safeScore = if (score.isNaN()) 0.0 else score
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text(label, color = Color.Gray, fontSize = 11.sp, modifier = Modifier.weight(1f))
                    LinearProgressIndicator(progress = (safeScore / 100f).toFloat(), modifier = Modifier.width(100.dp).height(6.dp),
                        color = Color(0xFF10B981), trackColor = Color.White.copy(0.1f))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("${safeScore.toInt()}%", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Critical supplier list
        DashboardSection("CRITICAL SUPPLIERS") {
            val critical = suppliers.filter { it.healthScore < 40 }
            if (critical.isEmpty()) Text("✓ All suppliers are healthy", color = Color(0xFF10B981), fontSize = 12.sp)
            else critical.take(5).forEach { s ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                    Icon(Icons.Default.Warning, null, tint = Color(0xFFEF4444), modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(s.name, color = Color.White, fontSize = 11.sp, modifier = Modifier.weight(1f))
                    Text("${s.healthScore.toInt()}%", color = Color(0xFFEF4444), fontSize = 11.sp)
                }
            }
        }
    }
}

@Composable
fun RiskDashboardScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = rememberScrollState()

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("RISK INTELLIGENCE", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("High Risk", suppliers.count { it.riskScore > 70 }.toString(), Color(0xFFEF4444), Modifier.weight(1f))
            KpiCard("Medium Risk", suppliers.count { it.riskScore in 40.0..70.0 }.toString(), Color(0xFFF59E0B), Modifier.weight(1f))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("Low Risk", suppliers.count { it.riskScore < 40 }.toString(), Color(0xFF10B981), Modifier.weight(1f))
            KpiCard("Avg Risk Score", if (suppliers.isEmpty()) "N/A" else "${suppliers.map { it.riskScore }.average().toInt()}", Color(0xFF3B82F6), Modifier.weight(1f))
        }

        DashboardSection("HIGHEST RISK SUPPLIERS") {
            if (suppliers.isEmpty()) EmptyDataPlaceholder("Upload dataset to view risk data.")
            else suppliers.sortedByDescending { it.riskScore }.take(5).forEach { s ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Shield, null, tint = Color(0xFFEF4444), modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(s.name, color = Color.White, fontSize = 11.sp, modifier = Modifier.weight(1f))
                    Text("Risk: ${s.riskScore.toInt()}", color = Color(0xFFEF4444), fontSize = 10.sp)
                }
            }
        }
    }
}

@Composable
fun RealtimeDashboardScreen(vm: SupplierViewModel = hiltViewModel()) {
    val scroll = rememberScrollState()
    val suppliers by vm.suppliers.collectAsState()

    // No longer using tick for mock updates

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.size(8.dp).background(Color(0xFF10B981), RoundedCornerShape(4.dp)))
            Spacer(modifier = Modifier.width(8.dp))
            Text("REALTIME MONITORING", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }
        Text("Live supply chain telemetry — updates every 3s", color = Color(0xFF64748B), fontSize = 11.sp)

        DashboardSection("LIVE METRICS") {
            if (suppliers.isEmpty()) EmptyDataPlaceholder("Upload dataset to view telemetry.")
            else {
                val baseMetrics = listOf(
                    Triple("Total Tracked Nodes", suppliers.size.toString(), Color(0xFF10B981)),
                    Triple("Avg Health", suppliers.map { it.healthScore }.average().toInt().toString(), Color(0xFF3B82F6)),
                    Triple("Critical Risk Nodes", suppliers.count { it.riskScore > 80 }.toString(), Color(0xFFF59E0B)),
                    Triple("Backup Capacity", suppliers.count { it.isBackup }.toString(), Color(0xFFA855F7))
                )
                baseMetrics.forEach { (label, value, color) ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(label, color = Color.Gray, fontSize = 11.sp, modifier = Modifier.weight(1f))
                        Text(value, color = color, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        DashboardSection("RECENTLY ADDED SUPPLIERS") {
            if (suppliers.isEmpty()) EmptyDataPlaceholder("No recent events")
            else {
                suppliers.takeLast(5).reversed().forEach { s ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp)) {
                        Box(modifier = Modifier.size(6.dp).background(Color(0xFF3B82F6), RoundedCornerShape(3.dp)).padding(top = 4.dp))
                        Spacer(modifier = Modifier.width(10.dp))
                        Text("Supplier registered: ${s.name} (${s.country ?: "Unknown"})", color = Color(0xFF94A3B8), fontSize = 10.sp)
                    }
                }
            }
        }
    }
}

// ── Shared UI Components ──────────────────────────────────────────────────────

@Composable
fun KpiCard(label: String, value: String, color: Color, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(0.05f))
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(label, color = Color(0xFF64748B), fontSize = 9.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(6.dp))
            Text(value, color = color, fontSize = 22.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun DashboardSection(title: String, content: @Composable ColumnScope.() -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(0.05f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(title, color = Color(0xFF64748B), fontSize = 9.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(12.dp))
            content()
        }
    }
}

@Composable
fun EmptyDataPlaceholder(message: String) {
    Box(modifier = Modifier.fillMaxWidth().padding(16.dp), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(Icons.Default.Cloud, null, tint = Color(0xFF3B82F6).copy(0.3f), modifier = Modifier.size(36.dp))
            Spacer(modifier = Modifier.height(8.dp))
            Text(message, color = Color(0xFF64748B), fontSize = 11.sp)
        }
    }
}
