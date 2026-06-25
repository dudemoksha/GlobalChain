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

@Composable
fun AnalyticsHubScreen(navController: NavController, vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF020617))
            .padding(16.dp)
            .verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("ENTERPRISE ANALYTICS HUB", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Unified supply chain intelligence", color = Color(0xFF64748B), fontSize = 11.sp)
        Spacer(modifier = Modifier.height(4.dp))

        if (suppliers.isEmpty()) {
            EmptyDataPlaceholder("Upload a dataset to generate enterprise analytics.")
        } else {
            val total = suppliers.size
            val avgHealth = suppliers.map { it.healthScore }.average().toInt()
            val avgRisk = suppliers.map { it.riskScore }.average().toInt()
            val criticalCount = suppliers.count { it.healthScore < 40 || it.riskScore > 70 }
            val tier1 = suppliers.count { it.tierLevel == 1 }
            val tier2 = suppliers.count { it.tierLevel == 2 }
            val tier3 = suppliers.count { it.tierLevel == 3 }
            val backups = suppliers.count { it.isBackup }

            // KPI Grid
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                KpiCard("Total Suppliers", total.toString(), Color(0xFF3B82F6), Modifier.weight(1f))
                KpiCard("Avg Health", "$avgHealth%", if (avgHealth >= 70) Color(0xFF10B981) else Color(0xFFEF4444), Modifier.weight(1f))
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                KpiCard("Avg Risk", "$avgRisk%", if (avgRisk < 40) Color(0xFF10B981) else Color(0xFFF59E0B), Modifier.weight(1f))
                KpiCard("Critical Nodes", criticalCount.toString(), Color(0xFFEF4444), Modifier.weight(1f))
            }

            // Tier Breakdown
            DashboardSection("TIER DISTRIBUTION") {
                TierBar("Tier 1 (Critical)", tier1, total, Color(0xFFEF4444))
                TierBar("Tier 2 (Strategic)", tier2, total, Color(0xFFF59E0B))
                TierBar("Tier 3 (Support)", tier3, total, Color(0xFF10B981))
                TierBar("Backups", backups, total, Color(0xFF3B82F6))
            }

            // Health Distribution
            DashboardSection("HEALTH SCORE DISTRIBUTION") {
                val bands = listOf(
                    "0-40 (Critical)" to suppliers.count { it.healthScore < 40 },
                    "40-70 (At Risk)" to suppliers.count { it.healthScore >= 40 && it.healthScore < 70 },
                    "70-100 (Healthy)" to suppliers.count { it.healthScore >= 70 }
                )
                bands.forEach { (label, count) ->
                    TierBar(label, count, total, Color(0xFFA855F7))
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
fun TierBar(label: String, count: Int, total: Int, color: Color) {
    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
        Text(label, color = Color(0xFF94A3B8), fontSize = 11.sp, modifier = Modifier.width(100.dp))
        LinearProgressIndicator(
            progress = if (total > 0) count / total.toFloat() else 0f,
            color = color,
            trackColor = Color.White.copy(alpha = 0.05f),
            modifier = Modifier.weight(1f).height(6.dp)
        )
        Text(count.toString(), color = color, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.width(30.dp).padding(start = 8.dp))
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
    val highRiskCount = s.count { it.riskScore > 70 }
    
    AnalyticsScreen("FORECAST ANALYTICS", "Demand & supply forecasting intelligence", Color(0xFF3B82F6), vm,
        stats = listOf(
            Triple("Total Tracked", s.size.toString(), Color(0xFF3B82F6)),
            Triple("High Risk Nodes", highRiskCount.toString(), Color(0xFFEF4444))
        ),
        metrics = listOf(
            "Avg Risk Score" to (if (s.isEmpty()) 0 else s.map { it.riskScore }.average().toInt())
        ),
        insights = if (highRiskCount > 0) listOf("$highRiskCount suppliers are currently high risk and may impact future forecasts.") else emptyList()
    )
}

@Composable
fun FinancialAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("FINANCIAL ANALYTICS", "Cost exposure & revenue impact analysis", Color(0xFF10B981), vm,
        stats = listOf(
            Triple("Nodes Evaluated", s.size.toString(), Color(0xFF10B981))
        ),
        metrics = listOf(
            "Avg Supplier Health" to (if (s.isEmpty()) 0 else s.map { it.healthScore }.average().toInt())
        ),
        insights = if (s.isNotEmpty()) listOf("Financial exposure is tied to ${s.size} uploaded supplier nodes.") else emptyList()
    )
}

@Composable
fun DemandAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("DEMAND ANALYTICS", "Demand pattern intelligence & sensing", Color(0xFFA855F7), vm,
        stats = listOf(Triple("Total Suppliers", s.size.toString(), Color(0xFFA855F7))),
        metrics = emptyList(),
        insights = emptyList()
    )
}

@Composable
fun DependencyAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    val tier1 = s.count { it.tierLevel == 1 }
    val backups = s.count { it.isBackup }
    
    AnalyticsScreen("DEPENDENCY ANALYTICS", "Node dependency risk analysis", Color(0xFFF59E0B), vm,
        stats = listOf(
            Triple("Tier 1 Nodes", tier1.toString(), Color(0xFFEF4444)),
            Triple("Backup Nodes", backups.toString(), Color(0xFF10B981))
        ),
        metrics = listOf(
            "Backup Coverage" to (if (s.isEmpty()) 0 else (backups.toFloat() / s.size * 100).toInt())
        ),
        insights = if (tier1 > 0) listOf("You have $tier1 primary tier 1 dependencies.") else emptyList()
    )
}

@Composable
fun LogisticsAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("LOGISTICS ANALYTICS", "Route optimization & carrier performance", Color(0xFF06B6D4), vm,
        stats = listOf(Triple("Total Nodes", s.size.toString(), Color(0xFF06B6D4))),
        metrics = emptyList(),
        insights = emptyList()
    )
}

@Composable
fun InventoryAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("INVENTORY ANALYTICS", "Stock intelligence & buffer optimization", Color(0xFF14B8A6), vm,
        stats = listOf(Triple("Total Suppliers", s.size.toString(), Color(0xFF14B8A6))),
        metrics = emptyList(),
        insights = emptyList()
    )
}

@Composable
fun ManufacturingAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("MANUFACTURING ANALYTICS", "Production capacity & efficiency intelligence", Color(0xFFE97316), vm,
        stats = listOf(Triple("Tracked Nodes", s.size.toString(), Color(0xFFE97316))),
        metrics = listOf(
            "Avg Quality Score" to (if (s.isEmpty()) 0 else s.map { it.qualityScore }.average().toInt())
        ),
        insights = emptyList()
    )
}

@Composable
fun GeopoliticalAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    val regionsCount = s.mapNotNull { it.region }.distinct().size
    AnalyticsScreen("GEOPOLITICAL ANALYTICS", "Regional conflict & policy risk intelligence", Color(0xFFEF4444), vm,
        stats = listOf(
            Triple("Regions Active", regionsCount.toString(), Color(0xFFF59E0B)),
            Triple("Total Nodes", s.size.toString(), Color(0xFFEF4444))
        ),
        metrics = emptyList(),
        insights = if (regionsCount > 0) listOf("Supply chain spans across $regionsCount distinct geographic regions.") else emptyList()
    )
}

@Composable
fun CyberAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("CYBER ANALYTICS", "Digital threat & infrastructure risk monitoring", Color(0xFF8B5CF6), vm,
        stats = listOf(Triple("Tracked Suppliers", s.size.toString(), Color(0xFF8B5CF6))),
        metrics = emptyList(),
        insights = emptyList()
    )
}

@Composable
fun PredictiveAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("PREDICTIVE ANALYTICS", "AI-powered supply chain forecasting engine", Color(0xFFF59E0B), vm,
        stats = listOf(Triple("Nodes Analyzed", s.size.toString(), Color(0xFFF59E0B))),
        metrics = emptyList(),
        insights = emptyList()
    )
}

@Composable
fun ResilienceAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    val avgResilience = if (s.isEmpty()) 0 else s.map { it.resilienceScore }.average().toInt()
    AnalyticsScreen("RESILIENCE ANALYTICS", "Supply chain resilience scoring & optimization", Color(0xFF10B981), vm,
        stats = listOf(
            Triple("Avg Resilience", "$avgResilience%", Color(0xFF10B981)),
            Triple("Backup Nodes", s.count { it.isBackup }.toString(), Color(0xFFA855F7))
        ),
        metrics = listOf("Network Resilience" to avgResilience),
        insights = if (s.isNotEmpty()) listOf("Overall network resilience score is $avgResilience based on uploaded data.") else emptyList()
    )
}

@Composable
fun RecoveryAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("RECOVERY ANALYTICS", "Business continuity & recovery intelligence", Color(0xFF06B6D4), vm,
        stats = listOf(Triple("Backup Options", s.count { it.isBackup }.toString(), Color(0xFF06B6D4))),
        metrics = emptyList(),
        insights = emptyList()
    )
}

@Composable
fun RiskMatrixScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("RISK MATRIX", "Supply chain risk assessment grid", Color(0xFFEF4444), vm,
        stats = listOf(
            Triple("Critical Risk", s.count { it.riskScore > 80 }.toString(), Color(0xFFEF4444)),
            Triple("High Risk", s.count { it.riskScore in 60.0..80.0 }.toString(), Color(0xFFF59E0B)),
            Triple("Medium Risk", s.count { it.riskScore in 30.0..60.0 }.toString(), Color(0xFF3B82F6)),
            Triple("Low Risk", s.count { it.riskScore < 30 }.toString(), Color(0xFF10B981))
        ),
        metrics = emptyList(),
        insights = emptyList()
    )
}

@Composable
fun HealthAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    AnalyticsScreen("HEALTH ANALYTICS", "Supplier health tracking over time", Color(0xFF10B981), vm,
        stats = listOf(
            Triple("Avg Health", "${if (s.isEmpty()) 0 else s.map { it.healthScore }.average().toInt()}%", Color(0xFF10B981)),
            Triple("Critical", s.count { it.healthScore < 40 }.toString(), Color(0xFFEF4444)),
            Triple("Warning", s.count { it.healthScore in 40.0..70.0 }.toString(), Color(0xFFF59E0B)),
            Triple("Healthy", s.count { it.healthScore > 70 }.toString(), Color(0xFF10B981))
        ),
        metrics = listOf("Overall Health Rate" to (if (s.isEmpty()) 0 else s.map { it.healthScore }.average().toInt())),
        insights = emptyList()
    )
}

@Composable
fun RecommendationsAnalyticsScreen(vm: SupplierViewModel = hiltViewModel()) {
    val s by vm.suppliers.collectAsState()
    val criticalCount = s.count { it.riskScore > 80 }
    AnalyticsScreen("ANALYTICS RECOMMENDATIONS", "AI-driven analytics mitigations", Color(0xFFA855F7), vm,
        stats = listOf(Triple("Critical Action Items", criticalCount.toString(), Color(0xFFEF4444))),
        metrics = emptyList(),
        insights = if (criticalCount > 0) listOf("Recommend immediately reviewing $criticalCount critical risk suppliers.") else emptyList()
    )
}
