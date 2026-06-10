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

    // Mock alerts when Supabase returns empty (fallback for demo)
    val displayAlerts = if (alerts.isEmpty()) mockAlerts() else alerts
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
    val events = listOf(
        DisasterEvent("Typhoon Mawar", "Western Pacific", "Severe", "Supply routes impacted — reroute advised."),
        DisasterEvent("Earthquake M6.2", "Taiwan Strait", "High", "Semiconductor facilities on alert."),
        DisasterEvent("Flooding", "Bangladesh Delta", "Critical", "Textile supply chain disruption confirmed."),
        DisasterEvent("Wildfire", "Canada BC", "Medium", "Lumber supply delays — 2-3 weeks expected."),
        DisasterEvent("Drought", "California", "High", "Agriculture supply reduction up to 35%."),
    )

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("DISASTER INTELLIGENCE", color = Color(0xFFEF4444), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Real-time natural disaster monitoring", color = Color(0xFF64748B), fontSize = 11.sp)

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("Active Events", events.size.toString(), Color(0xFFEF4444), Modifier.weight(1f))
            KpiCard("Critical", events.count { it.severity == "Critical" }.toString(), Color(0xFFF59E0B), Modifier.weight(1f))
        }

        DashboardSection("ACTIVE DISASTER EVENTS") {
            events.forEach { event ->
                val c = when (event.severity) { "Critical" -> Color(0xFFEF4444); "High" -> Color(0xFFF59E0B); "Severe" -> Color(0xFFA855F7); else -> Color(0xFF3B82F6) }
                Card(colors = CardDefaults.cardColors(containerColor = c.copy(0.05f)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, c.copy(0.2f)),
                    shape = RoundedCornerShape(10.dp), modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(modifier = Modifier.fillMaxWidth()) {
                            Text(event.name, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                            Text(event.severity, color = c, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                        Text(event.location, color = Color(0xFF64748B), fontSize = 10.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(event.impact, color = Color(0xFF94A3B8), fontSize = 10.sp)
                    }
                }
            }
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

        val feedItems = listOf(
            "⚠️ [CRITICAL] Bangladesh flooding — 12 supplier facilities offline", "🌊 Tsunami advisory lifted — Japan East Coast",
            "🔥 Australian bushfire containment at 60%", "⚡ Power grid failure — Eastern EU affecting 4 suppliers",
            "🌪️ Cyclone Freddy downgraded to Category 2", "📡 Geomagnetic storm warning — satellite communications affected",
            "🏭 Chemical plant explosion — Rhine River, Germany", "🚢 Suez Canal partial blockage cleared"
        )
        feedItems.forEachIndexed { i, item ->
            Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(10.dp),
                modifier = Modifier.fillMaxWidth()) {
                Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text("${i + 1}", color = Color(0xFF3B82F6), fontSize = 9.sp, fontWeight = FontWeight.Bold,
                        modifier = Modifier.width(20.dp))
                    Text(item, color = Color(0xFF94A3B8), fontSize = 11.sp)
                }
            }
        }
    }
}

// ── Weather Intelligence ──────────────────────────────────────────────────────
@Composable
fun WeatherIntelligenceScreen() {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("WEATHER INTELLIGENCE", color = Color(0xFF06B6D4), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Climate risk monitoring for supply routes", color = Color(0xFF64748B), fontSize = 11.sp)

        DashboardSection("WEATHER RISK BY REGION") {
            listOf("Asia Pacific" to 72, "North America" to 34, "Europe" to 21, "Middle East" to 58,
                "Sub-Saharan Africa" to 81, "Latin America" to 45).forEach { (region, risk) ->
                val c = when { risk > 70 -> Color(0xFFEF4444); risk > 40 -> Color(0xFFF59E0B); else -> Color(0xFF10B981) }
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 7.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text(region, color = Color(0xFF64748B), fontSize = 11.sp, modifier = Modifier.weight(1f))
                    LinearProgressIndicator(progress = risk / 100f, modifier = Modifier.width(80.dp).height(4.dp),
                        color = c, trackColor = Color.White.copy(0.08f))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("$risk%", color = c, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        DashboardSection("SEASONAL ALERTS") {
            listOf("Monsoon season active in South Asia — logistics delays expected",
                "Hurricane season peak — Gulf of Mexico routes on advisory",
                "Arctic Oscillation event — Northern Europe cold chain disruption risk",
                "El Niño forecast: Pacific trade winds disruption through Q3").forEach { alert ->
                Row(modifier = Modifier.padding(vertical = 6.dp)) {
                    Text("☁️", fontSize = 14.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(alert, color = Color(0xFF94A3B8), fontSize = 11.sp, modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

// ── AI Recommendations ────────────────────────────────────────────────────────
@Composable
fun RecommendationCenterScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = rememberScrollState()

    val recs = if (suppliers.isNotEmpty()) {
        suppliers.filter { it.healthScore < 70 }.take(5).mapIndexed { i, s ->
            Recommendation("Activate Backup Supplier ${i + 1}", "Critical",
                "${s.name} health at ${s.healthScore.toInt()}% — initiate failover to verified backup.",
                "-${20 + i * 5}% risk", "+${15 + i * 3}% logistics")
        }
    } else mockRecommendations()

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("AI RECOMMENDATIONS", color = Color(0xFFA855F7), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("${recs.size} active mitigation vectors", color = Color(0xFF64748B), fontSize = 11.sp)

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

data class Recommendation(val title: String, val priority: String, val description: String, val riskImpact: String, val logisticsImpact: String)

// ── Intel Models, Timeline, Reports ──────────────────────────────────────────
@Composable
fun IntelModelsScreen() {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("INTELLIGENCE MODELS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Active AI risk & prediction models", color = Color(0xFF64748B), fontSize = 11.sp)

        listOf("Disruption Predictor v3.2" to "91.4% accuracy", "Demand Sensing v2.1" to "87.2% accuracy",
            "Risk Propagation Model" to "Online", "Geopolitical Risk Engine" to "Online",
            "Supplier Health Classifier" to "94.1% accuracy", "Logistics Delay Estimator" to "88.7% accuracy"
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
fun TimelineScreen() {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("EVENTS TIMELINE", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)

        val events = listOf(
            Triple("2h ago", "Supplier Alert", "Tier 1 supplier health dropped to 38%"), Triple("4h ago", "Simulation", "Earthquake sim completed — 14 nodes affected"),
            Triple("6h ago", "Data Upload", "New CSV dataset ingested — 234 records"), Triple("1d ago", "Admin", "Organization 'TechCorp' approved"),
            Triple("2d ago", "Disaster", "Typhoon warning issued for APAC region"), Triple("3d ago", "Recommendation", "AI recommended 3 backup supplier activations")
        )
        events.forEach { (time, type, desc) ->
            Row(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.width(44.dp)) {
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

@Composable
fun ReportsScreen() {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("INTELLIGENCE REPORTS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)

        listOf("Monthly Supply Chain Risk Report", "Quarterly Supplier Performance Review",
            "Simulation Impact Analysis — June 2025", "Geopolitical Risk Assessment Q2",
            "Financial Exposure & Recovery Plan", "Cyber Threat Landscape Report"
        ).forEachIndexed { i, title ->
            Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()) {
                Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Description, null, tint = Color(0xFF3B82F6), modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(title, color = Color.White, fontSize = 12.sp)
                        Text("PDF • Generated ${i + 1} days ago", color = Color(0xFF64748B), fontSize = 9.sp)
                    }
                    Icon(Icons.Default.Download, null, tint = Color(0xFF3B82F6), modifier = Modifier.size(18.dp))
                }
            }
        }
    }
}

// ── Mock fallback data ─────────────────────────────────────────────────────────
private fun mockAlerts() = listOf(
    Alert("1", "Tier 1 Supplier Health Critical", "Critical", "Supplier health dropped to 32% — immediate action needed.", "Supplier", "", false),
    Alert("2", "Geopolitical Risk Elevated", "High", "Conflict escalation detected in key sourcing region.", "Geopolitical", "", false),
    Alert("3", "Logistics Route Disruption", "Medium", "Red Sea route congestion adding 8-12 day delays.", "Logistics", "", false),
    Alert("4", "Cyber Threat Detected", "High", "Anomalous access pattern detected in supply chain portal.", "Cyber", "", false),
    Alert("5", "Weather Event Advisory", "Medium", "Category 3 cyclone tracking toward APAC supply cluster.", "Weather", "", false),
    Alert("6", "Demand Spike Alert", "Low", "Demand signal 34% above baseline — capacity review needed.", "Demand", "", true),
)

private fun mockRecommendations() = listOf(
    Recommendation("Activate Backup Supplier Alpha-7", "Critical", "Primary Tier 1 supplier offline — initiate emergency failover.", "-34% risk", "+18% logistics"),
    Recommendation("Reroute Shipment via Pacific", "High", "Red Sea congestion — alternative Pacific routing saves 6 days.", "-21% risk", "+24% logistics"),
    Recommendation("Pre-book Q4 Capacity Now", "Medium", "Seasonal demand surge predicted — secure capacity ahead.", "-15% risk", "+12% logistics"),
)
