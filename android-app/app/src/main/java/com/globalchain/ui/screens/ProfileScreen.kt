package com.globalchain.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.globalchain.ui.screens.dashboard.DashboardSection
import com.globalchain.ui.screens.dashboard.KpiCard
import com.globalchain.ui.viewmodel.SupplierViewModel

@Composable
fun ProfileScreen(vm: SupplierViewModel = hiltViewModel()) {
    val suppliers by vm.suppliers.collectAsState()
    val scroll = rememberScrollState()

    val totalSuppliers = suppliers.size
    val regions = suppliers.mapNotNull { it.country }.distinct().size
    val avgHealth = if (suppliers.isNotEmpty()) suppliers.map { it.healthScore }.average().toInt() else 0
    val avgRisk = if (suppliers.isNotEmpty()) suppliers.map { it.riskScore }.average().toInt() else 0
    val tier1Count = suppliers.count { it.tierLevel == 1 }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF020617))
            .padding(16.dp)
            .verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Column {
                Text("ENTERPRISE PROFILE", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Text("Account and Organization Details", color = Color(0xFF64748B), fontSize = 11.sp)
            }
            IconButton(onClick = { /* TODO Settings */ }) {
                Icon(Icons.Default.Settings, null, tint = Color(0xFF64748B))
            }
        }

        // Identity card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0f172a).copy(alpha = 0.6f)),
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF3b82f6).copy(alpha = 0.15f))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .background(Color(0xFF3b82f6).copy(alpha = 0.1f), RoundedCornerShape(12.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.Business, contentDescription = null, tint = Color(0xFF3b82f6), modifier = Modifier.size(28.dp))
                }
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text("GLOBAL SUPPLY CORP", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    Text("Enterprise Administrator", color = Color(0xFF3B82F6), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Text("GlobalChain Intelligence Node", color = Color(0xFF64748B), fontSize = 11.sp)
                }
            }
        }

        // Network Statistics
        DashboardSection("NETWORK INTELLIGENCE") {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                KpiCard("Total Suppliers", totalSuppliers.toString(), Color(0xFF3B82F6), Modifier.weight(1f))
                KpiCard("Active Regions", regions.toString(), Color(0xFFF59E0B), Modifier.weight(1f))
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                val healthColor = if (avgHealth >= 70) Color(0xFF10B981) else Color(0xFFEF4444)
                val riskColor = if (avgRisk > 70) Color(0xFFEF4444) else Color(0xFF10B981)
                KpiCard("Avg Network Health", "$avgHealth%", healthColor, Modifier.weight(1f))
                KpiCard("Avg Network Risk", "$avgRisk%", riskColor, Modifier.weight(1f))
            }
        }

        DashboardSection("INFRASTRUCTURE") {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                KpiCard("Tier 1 (Critical)", tier1Count.toString(), Color(0xFFEF4444), Modifier.weight(1f))
                KpiCard("Data Status", if (suppliers.isNotEmpty()) "Uploaded" else "Empty", if (suppliers.isNotEmpty()) Color(0xFF10B981) else Color(0xFF64748B), Modifier.weight(1f))
            }
        }
    }
}
