package com.globalchain.ui.screens.analytics

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.globalchain.navigation.Screen
import com.globalchain.ui.screens.dashboard.DashboardSection
import com.globalchain.ui.screens.dashboard.EmptyDataPlaceholder
import com.globalchain.ui.screens.dashboard.KpiCard
import com.globalchain.ui.viewmodel.SupplierViewModel

// ── Analytics Hub (entry point) ───────────────────────────────────────────────
@Composable
fun AnalyticsHubScreen(navController: NavController) {
    val modules = listOf(
        AnalyticsModule("Forecast", "Demand & supply forecasting", Icons.Default.TrendingUp, Color(0xFF3B82F6), Screen.AnalyticsForecast),
        AnalyticsModule("Financial", "Cost exposure & revenue impact", Icons.Default.AttachMoney, Color(0xFF10B981), Screen.AnalyticsFinancial),
        AnalyticsModule("Demand", "Demand pattern intelligence", Icons.Default.BarChart, Color(0xFFA855F7), Screen.AnalyticsDemand),
        AnalyticsModule("Dependency", "Node dependency analysis", Icons.Default.AccountTree, Color(0xFFF59E0B), Screen.AnalyticsDependency),
        AnalyticsModule("Logistics", "Route & carrier analytics", Icons.Default.LocalShipping, Color(0xFF06B6D4), Screen.AnalyticsLogistics),
        AnalyticsModule("Inventory", "Stock & buffer intelligence", Icons.Default.Inventory2, Color(0xFF14B8A6), Screen.AnalyticsInventory),
        AnalyticsModule("Manufacturing", "Production capacity analytics", Icons.Default.Build, Color(0xFFE97316), Screen.AnalyticsManufacturing),
        AnalyticsModule("Geopolitical", "Regional risk intelligence", Icons.Default.Public, Color(0xFFEF4444), Screen.AnalyticsGeopolitical),
        AnalyticsModule("Cyber", "Digital threat analytics", Icons.Default.Security, Color(0xFF8B5CF6), Screen.AnalyticsCyber),
        AnalyticsModule("Predictive", "AI-powered forecasting", Icons.Default.AutoGraph, Color(0xFFF59E0B), Screen.AnalyticsPredictive),
        AnalyticsModule("Resilience", "Resilience scoring", Icons.Default.Shield, Color(0xFF10B981), Screen.AnalyticsResilience),
        AnalyticsModule("Risk Matrix", "Risk assessment matrix", Icons.Default.GridView, Color(0xFFEF4444), Screen.AnalyticsMatrix),
        AnalyticsModule("Recovery", "Recovery & continuity", Icons.Default.Restore, Color(0xFF06B6D4), Screen.AnalyticsRecovery),
    )

    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("ANALYTICS SUITE", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("${modules.size} intelligence modules", color = Color(0xFF64748B), fontSize = 11.sp)
        Spacer(modifier = Modifier.height(8.dp))

        modules.chunked(2).forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                row.forEach { module ->
                    AnalyticsModuleCard(module, Modifier.weight(1f)) { navController.navigate(module.screen.route) }
                }
                if (row.size == 1) Spacer(modifier = Modifier.weight(1f))
            }
        }
    }
}

data class AnalyticsModule(val title: String, val subtitle: String, val icon: ImageVector, val color: Color, val screen: Screen)

@Composable
fun AnalyticsModuleCard(module: AnalyticsModule, modifier: Modifier, onClick: () -> Unit) {
    Card(modifier = modifier.clickable { onClick() }.height(110.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
        shape = RoundedCornerShape(14.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, module.color.copy(0.2f))) {
        Column(modifier = Modifier.padding(14.dp)) {
            Icon(module.icon, null, tint = module.color, modifier = Modifier.size(22.dp))
            Spacer(modifier = Modifier.height(8.dp))
            Text(module.title, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Text(module.subtitle, color = Color(0xFF64748B), fontSize = 9.sp, maxLines = 2)
        }
    }
}

// ── Shared Analytics Screen Builder ──────────────────────────────────────────

@Composable
private fun AnalyticsScreen(
    title: String, subtitle: String, accentColor: Color,
    vm: SupplierViewModel = hiltViewModel(),
    stats: List<Triple<String, String, Color>>,
    metrics: List<Pair<String, Int>>,
    insights: List<String>
) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = rememberScrollState()

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text(title, color = accentColor, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text(subtitle, color = Color(0xFF64748B), fontSize = 11.sp)

        if (suppliers.isEmpty()) {
            EmptyDataPlaceholder("Upload a dataset to enable $title analytics.")
        } else {
            // KPIs
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                stats.take(2).forEach { (label, value, color) -> KpiCard(label, value, color, Modifier.weight(1f)) }
            }
            if (stats.size > 2) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    stats.drop(2).take(2).forEach { (label, value, color) -> KpiCard(label, value, color, Modifier.weight(1f)) }
                }
            }

            // Progress Metrics
            DashboardSection("PERFORMANCE METRICS") {
                metrics.forEach { (label, value) ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 7.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(label, color = Color(0xFF64748B), fontSize = 11.sp, modifier = Modifier.weight(1f))
                        LinearProgressIndicator(progress = value / 100f, modifier = Modifier.width(90.dp).height(5.dp),
                            color = accentColor, trackColor = Color.White.copy(0.08f))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("$value%", color = accentColor, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            // AI Insights
            DashboardSection("AI INSIGHTS") {
                insights.forEachIndexed { i, insight ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                        Box(modifier = Modifier.size(20.dp).background(accentColor.copy(0.15f), RoundedCornerShape(4.dp)),
                            contentAlignment = Alignment.Center) {
                            Text("${i + 1}", color = accentColor, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(insight, color = Color(0xFF94A3B8), fontSize = 11.sp, modifier = Modifier.weight(1f))
                    }
                    if (i < insights.lastIndex) Divider(color = Color.White.copy(0.04f), modifier = Modifier.padding(vertical = 4.dp))
                }
            }
        }
    }
}

// ── All 13 Analytics Screens ──────────────────────────────────────────────────

@Composable
fun ForecastAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("FORECAST ANALYTICS", "Demand & supply forecasting intelligence", Color(0xFF3B82F6), vm,
        stats = listOf(Triple("Forecast Accuracy", "87%", Color(0xFF3B82F6)), Triple("Demand Variance", "±12%", Color(0xFFF59E0B)),
            Triple("Supply Coverage", "94%", Color(0xFF10B981)), Triple("Lead Time Avg", "18 days", Color(0xFF06B6D4))),
        metrics = listOf("Demand Precision" to 87, "Supply Readiness" to 94, "Inventory Buffer" to 72, "Carrier Reliability" to 81),
        insights = listOf("Demand expected to increase 23% over next quarter based on seasonal patterns.",
            "3 suppliers may face capacity constraints — activate backup procurement.",
            "Lead times projected to stabilize within 2 weeks based on current routing data."))
}

@Composable
fun FinancialAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("FINANCIAL ANALYTICS", "Cost exposure & revenue impact analysis", Color(0xFF10B981), vm,
        stats = listOf(Triple("Total Exposure", "$4.2M", Color(0xFFEF4444)), Triple("Cost Savings", "$820K", Color(0xFF10B981)),
            Triple("Risk Premium", "8.3%", Color(0xFFF59E0B)), Triple("Recovery Cost", "$1.1M", Color(0xFF3B82F6))),
        metrics = listOf("Budget Variance" to 76, "Cost Efficiency" to 88, "ROI on Resilience" to 64, "Insurance Coverage" to 91),
        insights = listOf("Financial exposure concentrated in Asia-Pacific region at 42% of total.",
            "Implementing dual-sourcing could reduce exposure by \$1.4M annually.",
            "Current resilience investment shows 3.2x ROI based on simulated disruption scenarios."))
}

@Composable
fun DemandAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    AnalyticsScreen("DEMAND ANALYTICS", "Demand pattern intelligence & sensing", Color(0xFFA855F7), vm,
        stats = listOf(Triple("Demand Signal", "Strong", Color(0xFF10B981)), Triple("Volatility", "Medium", Color(0xFFF59E0B)),
            Triple("Stockout Risk", "Low", Color(0xFF3B82F6)), Triple("Forecast Bias", "+4.2%", Color(0xFFA855F7))),
        metrics = listOf("Signal Accuracy" to 82, "Seasonal Adj." to 91, "Market Sensitivity" to 68, "Demand Elasticity" to 74),
        insights = listOf("Q3 demand signals indicate 15% uplift in electronics component procurement.",
            "Consumer demand volatility in APAC has decreased — reduce safety stock by 8%.",
            "Emerging demand cluster detected in Southeast Asia — tier-2 capacity advisory issued."))
}

@Composable
fun DependencyAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("DEPENDENCY ANALYTICS", "Node dependency risk analysis", Color(0xFFF59E0B), vm,
        stats = listOf(Triple("Single Points", s.count { it.tierLevel == 1 && !it.isBackup }.toString(), Color(0xFFEF4444)),
            Triple("Redundancy", "${minOf(100, s.count { it.isBackup } * 10)}%", Color(0xFF10B981)),
            Triple("Avg Tier Depth", "2.4", Color(0xFF3B82F6)), Triple("Circular Deps", "3", Color(0xFFF59E0B))),
        metrics = listOf("Tier 1 Concentration" to 78, "Geographic Spread" to 62, "Category Diversity" to 85, "Backup Coverage" to 45),
        insights = listOf("High concentration risk in Tier 1 manufacturing — 3 nodes control 67% of material flow.",
            "Circular dependencies detected between 3 regional clusters — recommend audit.",
            "Backup supplier coverage gap identified for critical electronic components."))
}

@Composable
fun LogisticsAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    AnalyticsScreen("LOGISTICS ANALYTICS", "Route optimization & carrier performance", Color(0xFF06B6D4), vm,
        stats = listOf(Triple("On-Time Delivery", "89%", Color(0xFF10B981)), Triple("Avg Transit", "14 days", Color(0xFF3B82F6)),
            Triple("Port Delays", "6.2%", Color(0xFFF59E0B)), Triple("Cost Per Unit", "$48", Color(0xFF06B6D4))),
        metrics = listOf("Route Efficiency" to 89, "Carrier Reliability" to 83, "Port Throughput" to 71, "Last-Mile Perf." to 77),
        insights = listOf("Shanghai and Rotterdam ports showing 12% throughput increase — opportunistic routing advised.",
            "Air freight usage up 18% this quarter — evaluate cost vs. speed tradeoffs.",
            "3 carrier partnerships underperforming SLA — contract review recommended."))
}

@Composable
fun InventoryAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    AnalyticsScreen("INVENTORY ANALYTICS", "Stock intelligence & buffer optimization", Color(0xFF14B8A6), vm,
        stats = listOf(Triple("Inventory Health", "82%", Color(0xFF10B981)), Triple("Turnover Rate", "4.2x", Color(0xFF3B82F6)),
            Triple("Stockout Events", "7", Color(0xFFEF4444)), Triple("Overstock", "12%", Color(0xFFF59E0B))),
        metrics = listOf("Stock Accuracy" to 94, "Buffer Adequacy" to 78, "Obsolescence Rate" to 4, "Fill Rate" to 88),
        insights = listOf("Safety stock levels are 22% above optimal for electronics category — rationalize.",
            "Perishable component buffer requires immediate review — shelf-life threshold approaching.",
            "AI recommends dynamic safety stock adjustment based on real-time demand sensing."))
}

@Composable
fun ManufacturingAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    AnalyticsScreen("MANUFACTURING ANALYTICS", "Production capacity & efficiency intelligence", Color(0xFFE97316), vm,
        stats = listOf(Triple("Utilization", "78%", Color(0xFFE97316)), Triple("OEE Score", "71%", Color(0xFF3B82F6)),
            Triple("Defect Rate", "1.8%", Color(0xFFEF4444)), Triple("Throughput", "+6%", Color(0xFF10B981))),
        metrics = listOf("Capacity Utilization" to 78, "Quality Index" to 91, "Downtime Rate" to 8, "Process Efficiency" to 85),
        insights = listOf("Manufacturing partner in Vietnam operating at 95% capacity — surge risk ahead.",
            "Component defect rate increased 0.4% — initiate quality audit with Tier 1 suppliers.",
            "Predictive maintenance model identifies 2 facilities at high downtime risk in next 30 days."))
}

@Composable
fun GeopoliticalAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("GEOPOLITICAL ANALYTICS", "Regional conflict & policy risk intelligence", Color(0xFFEF4444), vm,
        stats = listOf(Triple("Conflict Zones", "4", Color(0xFFEF4444)), Triple("Sanction Risk", "High", Color(0xFFF59E0B)),
            Triple("Trade Policy", "Volatile", Color(0xFFA855F7)), Triple("Affected Nodes", s.count { (it.riskScore) > 60 }.toString(), Color(0xFFEF4444))),
        metrics = listOf("Regional Stability" to 42, "Trade Policy Risk" to 71, "Currency Volatility" to 58, "Regulatory Compliance" to 88),
        insights = listOf("Red Sea routing disruptions impacting 18% of supplier shipments — rerouting advisory active.",
            "Tariff escalation risk identified for APAC electronics procurement — hedge inventory positions.",
            "Sanction monitoring detected 2 tier-2 suppliers in restricted regions — compliance review required."))
}

@Composable
fun CyberAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    AnalyticsScreen("CYBER ANALYTICS", "Digital threat & infrastructure risk monitoring", Color(0xFF8B5CF6), vm,
        stats = listOf(Triple("Threat Level", "Elevated", Color(0xFFF59E0B)), Triple("Incidents (30d)", "12", Color(0xFFEF4444)),
            Triple("Patched Systems", "94%", Color(0xFF10B981)), Triple("Supply Vuln.", "7", Color(0xFF8B5CF6))),
        metrics = listOf("Endpoint Security" to 94, "Network Integrity" to 87, "Data Compliance" to 91, "Supplier Cyber Score" to 68),
        insights = listOf("3 tier-2 suppliers have unpatched critical CVEs — initiate vendor security advisories.",
            "Ransomware simulation indicates 6-day recovery window — improve backup protocols.",
            "Zero-trust architecture adoption across supply chain vendors at 34% — target 80% by Q4."))
}

@Composable
fun PredictiveAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("PREDICTIVE ANALYTICS", "AI-powered supply chain forecasting engine", Color(0xFFF59E0B), vm,
        stats = listOf(Triple("Model Accuracy", "91.4%", Color(0xFF10B981)), Triple("Predictions", "47", Color(0xFF3B82F6)),
            Triple("Alerts Predicted", "8", Color(0xFFF59E0B)), Triple("Confidence", "High", Color(0xFFA855F7))),
        metrics = listOf("Disruption Prediction" to 91, "Demand Sensing" to 87, "Risk Forecasting" to 83, "Inventory Optimization" to 76),
        insights = listOf("ML model predicts 34% probability of tier-1 disruption in next 60 days — mitigation recommended.",
            "Seasonal demand surge expected in Q4 — 18 suppliers identified for capacity pre-booking.",
            "Anomaly detection flagged unusual procurement patterns across 3 categories — investigate."))
}

@Composable
fun ResilienceAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    val avgResilience = if (s.isEmpty()) 0 else s.map { it.resilienceScore }.average().toInt()
    AnalyticsScreen("RESILIENCE ANALYTICS", "Supply chain resilience scoring & optimization", Color(0xFF10B981), vm,
        stats = listOf(Triple("Resilience Score", "$avgResilience%", Color(0xFF10B981)), Triple("Recovery Time", "8 days", Color(0xFF3B82F6)),
            Triple("Redundancy", "${s.count { it.isBackup }} backups", Color(0xFFA855F7)), Triple("Flexibility", "72%", Color(0xFFF59E0B))),
        metrics = listOf("Network Redundancy" to 58, "Geographic Spread" to 72, "Financial Buffer" to 65, "Recovery Capability" to 83),
        insights = listOf("Resilience score improved 12 points since last quarter due to backup supplier additions.",
            "Critical single-source dependencies still present in 4 categories — prioritize diversification.",
            "Recommended resilience investments have projected 4.1x ROI over 24-month horizon."))
}

@Composable
fun RecoveryAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    AnalyticsScreen("RECOVERY ANALYTICS", "Business continuity & recovery intelligence", Color(0xFF06B6D4), vm,
        stats = listOf(Triple("RTO Target", "72 hrs", Color(0xFF3B82F6)), Triple("RPO Target", "24 hrs", Color(0xFF10B981)),
            Triple("Recovery Plans", "8 active", Color(0xFFA855F7)), Triple("Last Test", "14 days", Color(0xFFF59E0B))),
        metrics = listOf("Plan Completeness" to 84, "Test Coverage" to 67, "Activation Speed" to 78, "Stakeholder Readiness" to 71),
        insights = listOf("Continuity plans for electronics and logistics categories require update — last reviewed 90+ days ago.",
            "Recovery simulation showed 18-hour time-to-activate gap — automation recommended.",
            "4 backup suppliers confirmed operationally ready for emergency activation within 48 hours."))
}

@Composable
fun RiskMatrixScreen(vm: SupplierViewModel = hiltViewModel()) {
    AnalyticsScreen("RISK MATRIX", "Supply chain risk assessment grid", Color(0xFFEF4444), vm,
        stats = listOf(Triple("Critical Risks", "4", Color(0xFFEF4444)), Triple("High Risks", "12", Color(0xFFF59E0B)),
            Triple("Medium Risks", "23", Color(0xFF3B82F6)), Triple("Low Risks", "45", Color(0xFF10B981))),
        metrics = listOf("Geo Risk" to 72, "Cyber Risk" to 45, "Financial Risk" to 32, "Supplier Risk" to 61),
        insights = listOf("Supplier Alpha is showing critical risk due to single-point dependency.", "Cyber risk is elevated across tier 2 suppliers."))
}
