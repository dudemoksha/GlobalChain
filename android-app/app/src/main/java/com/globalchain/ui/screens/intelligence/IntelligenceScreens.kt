package com.globalchain.ui.screens.intelligence

import androidx.compose.foundation.background
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
import com.globalchain.data.models.Alert
import com.globalchain.ui.screens.dashboard.DashboardSection
import com.globalchain.ui.screens.dashboard.EmptyDataPlaceholder
import com.globalchain.ui.screens.dashboard.KpiCard
import com.globalchain.ui.viewmodel.AlertsViewModel
import com.globalchain.ui.viewmodel.SupplierViewModel

// ── Alerts Screen ─────────────────────────────────────────────────────────────
@Composable
fun AlertsScreen(vm: AlertsViewModel = hiltViewModel()) {
    val alerts by vm.alerts.collectAsState()
    var tab by remember { mutableIntStateOf(0) }

    val displayAlerts = alerts
    val filtered = when (tab) {
        1 -> displayAlerts.filter { it.severity == "Critical" }
        2 -> displayAlerts.filter { !it.resolved }
        3 -> displayAlerts.filter { it.resolved }
        else -> displayAlerts
    }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617))) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("REALTIME ALERTS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Text("${displayAlerts.count { !it.resolved }} unresolved alerts", color = Color(0xFF64748B), fontSize = 11.sp)
            Spacer(modifier = Modifier.height(12.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                KpiCard("Critical", displayAlerts.count { it.severity == "Critical" }.toString(), Color(0xFFEF4444), Modifier.weight(1f))
                KpiCard("High", displayAlerts.count { it.severity == "High" }.toString(), Color(0xFFF59E0B), Modifier.weight(1f))
                KpiCard("Medium", displayAlerts.count { it.severity == "Medium" }.toString(), Color(0xFF3B82F6), Modifier.weight(1f))
            }
        }

        TabRow(selectedTabIndex = tab, containerColor = Color(0xFF0F172A), contentColor = Color(0xFF3B82F6)) {
            listOf("All", "Critical", "Active", "Resolved").forEachIndexed { i, label ->
                Tab(selected = tab == i, onClick = { tab = i },
                    text = { Text(label, fontSize = 11.sp) },
                    selectedContentColor = Color(0xFF3B82F6), unselectedContentColor = Color.Gray)
            }
        }

        LazyColumn(modifier = Modifier.fillMaxSize(), contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)) {
            if (filtered.isEmpty()) item { EmptyDataPlaceholder("No alerts in this category.") }
            items(filtered) { AlertCard(it) }
        }
    }
}

@Composable
fun AlertCard(alert: Alert) {
    val sevColor = when (alert.severity) {
        "Critical" -> Color(0xFFEF4444); "High" -> Color(0xFFF59E0B); "Medium" -> Color(0xFF3B82F6); else -> Color(0xFF10B981)
    }
    Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, sevColor.copy(0.25f)), modifier = Modifier.fillMaxWidth()) {
        Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.Top) {
            Box(modifier = Modifier.size(8.dp).background(sevColor, RoundedCornerShape(4.dp)).padding(top = 4.dp))
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(alert.title, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                    Text(alert.severity, color = sevColor, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(alert.description, color = Color(0xFF94A3B8), fontSize = 10.sp)
                Spacer(modifier = Modifier.height(6.dp))
                Row {
                    Text(alert.category, color = Color(0xFF3B82F6), fontSize = 9.sp)
                    Spacer(modifier = Modifier.weight(1f))
                    if (alert.resolved) Text("✓ Resolved", color = Color(0xFF10B981), fontSize = 9.sp)
                }
            }
        }
    }
}

// ── Disaster Intelligence ──────────────────────────────────────────────────────
@Composable
fun DisasterIntelligenceScreen() {
    val scroll = rememberScrollState()
    val events = emptyList<DisasterEvent>()

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("DISASTER INTELLIGENCE", color = Color(0xFFEF4444), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Real-time natural disaster monitoring", color = Color(0xFF64748B), fontSize = 11.sp)

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("Active Events", events.size.toString(), Color(0xFFEF4444), Modifier.weight(1f))
            KpiCard("Critical", events.count { it.severity == "Critical" }.toString(), Color(0xFFF59E0B), Modifier.weight(1f))
        }

        DashboardSection("ACTIVE DISASTER EVENTS") {
            EmptyDataPlaceholder("No active disaster events detected.")
        }
    }
}

data class DisasterEvent(val name: String, val location: String, val severity: String, val impact: String)

// ── Disaster Feed ─────────────────────────────────────────────────────────────
@Composable
fun DisasterFeedScreen() {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("LIVE DISASTER FEED", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Real-time global event streaming", color = Color(0xFF64748B), fontSize = 11.sp)

        val feedItems = emptyList<String>()
        if (feedItems.isEmpty()) {
            EmptyDataPlaceholder("No live feed events available.")
        }
    }
}

// ── Weather Intelligence ──────────────────────────────────────────────────────
@Composable
fun WeatherIntelligenceScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    val regions = s.mapNotNull { it.region }.distinct()
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("WEATHER INTELLIGENCE", color = Color(0xFF06B6D4), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Climate risk monitoring for supply routes", color = Color(0xFF64748B), fontSize = 11.sp)

        DashboardSection("WEATHER RISK BY REGION") {
            if (regions.isEmpty()) {
                EmptyDataPlaceholder("No regions tracked in dataset.")
            } else {
                regions.forEach { region ->
                    val risk = 10 // Baseline static risk
                    val c = Color(0xFF10B981)
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 7.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(region, color = Color(0xFF64748B), fontSize = 11.sp, modifier = Modifier.weight(1f))
                        LinearProgressIndicator(progress = risk / 100f, modifier = Modifier.width(80.dp).height(4.dp),
                            color = c, trackColor = Color.White.copy(0.08f))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("$risk%", color = c, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        DashboardSection("SEASONAL ALERTS") {
            EmptyDataPlaceholder("No active seasonal alerts for your regions.")
        }
    }
}

// ── AI Recommendations ────────────────────────────────────────────────────────
@Composable
fun RecommendationCenterScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = rememberScrollState()

    val recs = suppliers.filter { it.healthScore < 70 }.take(5).mapIndexed { i, s ->
        Recommendation("Review Supplier: ${s.name}", "Critical",
            "${s.name} health at ${s.healthScore.toInt()}% — review required.",
            "-10% risk", "+5% logistics")
    }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("AI RECOMMENDATIONS", color = Color(0xFFA855F7), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("${recs.size} active mitigation vectors", color = Color(0xFF64748B), fontSize = 11.sp)

        if (recs.isEmpty()) {
            EmptyDataPlaceholder("No active recommendations. Supply chain is healthy.")
        } else {
            recs.forEachIndexed { i, rec ->
                val c = when (rec.priority) { "Critical" -> Color(0xFFEF4444); "High" -> Color(0xFFF59E0B); else -> Color(0xFF3B82F6) }
                Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(14.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, c.copy(0.2f)), modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(24.dp).background(c.copy(0.15f), RoundedCornerShape(6.dp)),
                                contentAlignment = Alignment.Center) {
                                Text("${i + 1}", color = c, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(rec.title, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                            Text(rec.priority, color = c, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(rec.description, color = Color(0xFF94A3B8), fontSize = 11.sp)
                        Spacer(modifier = Modifier.height(10.dp))
                        Row {
                            Text(rec.riskImpact, color = Color(0xFF10B981), fontSize = 10.sp, modifier = Modifier.weight(1f))
                            Text(rec.logisticsImpact, color = Color(0xFF3B82F6), fontSize = 10.sp)
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Button(onClick = {}, modifier = Modifier.fillMaxWidth().height(36.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = c.copy(0.15f), contentColor = c),
                            border = androidx.compose.foundation.BorderStroke(1.dp, c.copy(0.3f))) {
                            Text("INITIATE PROTOCOL", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

data class Recommendation(val title: String, val priority: String, val description: String, val riskImpact: String, val logisticsImpact: String)

// ── Intel Models, Timeline, Reports ──────────────────────────────────────────
@Composable
fun IntelModelsScreen() {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("INTELLIGENCE MODELS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Active AI risk & prediction models", color = Color(0xFF64748B), fontSize = 11.sp)

        listOf("Disruption Predictor v3.2" to "Active", "Demand Sensing v2.1" to "Active",
            "Risk Propagation Model" to "Online", "Geopolitical Risk Engine" to "Online",
            "Supplier Health Classifier" to "Active", "Logistics Delay Estimator" to "Active"
        ).forEach { (model, status) ->
            Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()) {
                Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Psychology, null, tint = Color(0xFFA855F7), modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(model, color = Color.White, fontSize = 12.sp, modifier = Modifier.weight(1f))
                    Text(status, color = Color(0xFF10B981), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun TimelineScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = rememberScrollState()
    
    val events = suppliers.takeLast(10).reversed().map { s ->
        Triple(
            s.createdAt.take(10).ifEmpty { "Recent" },
            "Supplier Added", 
            "Supplier ${s.name} added to the system."
        )
    }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("EVENTS TIMELINE", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)

        if (events.isEmpty()) {
            EmptyDataPlaceholder("No timeline events.")
        } else {
            events.forEach { (time, type, desc) ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.width(64.dp)) {
                        Text(time, color = Color(0xFF64748B), fontSize = 8.sp, fontWeight = FontWeight.Bold)
                        Box(modifier = Modifier.width(1.dp).height(40.dp).background(Color.White.copy(0.1f)))
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(type, color = Color(0xFF3B82F6), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            Text(desc, color = Color(0xFF94A3B8), fontSize = 11.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ReportsScreen() {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("INTELLIGENCE REPORTS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)

        EmptyDataPlaceholder("No reports generated.")
    }
}

@Composable
fun ShippingIntelligenceScreen() {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("SHIPPING INTELLIGENCE", color = Color(0xFF3B82F6), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Global maritime and freight tracking", color = Color(0xFF64748B), fontSize = 11.sp)

        DashboardSection("ACTIVE SHIPMENTS") {
            EmptyDataPlaceholder("No active shipment routes found in your supplier dataset.")
        }
    }
}
