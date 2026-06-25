package com.globalchain.ui.screens.admin

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
import com.globalchain.data.models.AuditLog
import com.globalchain.data.models.Organization
import com.globalchain.ui.screens.dashboard.DashboardSection
import com.globalchain.ui.screens.dashboard.EmptyDataPlaceholder
import com.globalchain.ui.screens.dashboard.KpiCard
import com.globalchain.ui.viewmodel.AdminViewModel

import androidx.navigation.NavController

// ── Admin Dashboard ────────────────────────────────────────────────────────────
@Composable
fun AdminDashboardScreen(navController: NavController, vm: AdminViewModel = hiltViewModel()) {
    val orgs by vm.orgs.collectAsState()
    val logs by vm.auditLogs.collectAsState()
    val loading by vm.loading.collectAsState()
    val scroll = rememberScrollState()

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.AdminPanelSettings, null, tint = Color(0xFFEF4444), modifier = Modifier.size(22.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text("ADMIN PORTAL", color = Color(0xFFEF4444), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }
        Text("GlobalChain Super Administrator", color = Color(0xFF64748B), fontSize = 11.sp)

        if (loading) LinearProgressIndicator(modifier = Modifier.fillMaxWidth(), color = Color(0xFFEF4444))

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("Pending Orgs", orgs.size.toString(), Color(0xFFF59E0B), Modifier.weight(1f))
            KpiCard("Audit Events", logs.size.toString(), Color(0xFF3B82F6), Modifier.weight(1f))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("System Status", "Online", Color(0xFF10B981), Modifier.weight(1f))
            KpiCard("API Health", "98.2%", Color(0xFF10B981), Modifier.weight(1f))
        }

        DashboardSection("PENDING ORGANIZATION APPROVALS") {
            val pending = orgs.filter { it.status == "Pending" }
            if (pending.isEmpty()) Text("✓ No pending approvals", color = Color(0xFF10B981), fontSize = 12.sp)
            else pending.take(3).forEach { OrgApprovalRow(it, onApprove = { vm.approve(it.id) }, onReject = { vm.reject(it.id) }) }
        }

        DashboardSection("RECENT AUDIT EVENTS") {
            if (logs.isEmpty()) EmptyDataPlaceholder("No audit logs found")
            else {
                logs.take(5).forEach { log ->
                    Row(modifier = Modifier.padding(vertical = 5.dp)) {
                        Text(log.action, color = Color(0xFF3B82F6), fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                        Text(log.resource, color = Color(0xFF64748B), fontSize = 10.sp)
                    }
                }
            }
        }
    }
}

// ── Org Approvals ─────────────────────────────────────────────────────────────
@Composable
fun AdminOrgsScreen(vm: AdminViewModel = hiltViewModel()) {
    val orgs by vm.orgs.collectAsState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617))) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("ORGANIZATION APPROVALS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Text("${orgs.count { it.status == "Pending" }} pending approvals", color = Color(0xFF64748B), fontSize = 11.sp)
        }
        if (orgs.isEmpty()) EmptyDataPlaceholder("No organizations found")
        else {
            LazyColumn(contentPadding = PaddingValues(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(orgs) { org ->
                    OrgApprovalCard(org, onApprove = { vm.approve(org.id) }, onReject = { vm.reject(org.id) })
                }
            }
        }
    }
}

@Composable
fun OrgApprovalRow(org: Organization, onApprove: () -> Unit, onReject: () -> Unit) {
    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
        Column(modifier = Modifier.weight(1f)) {
            Text(org.name, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Text(org.email, color = Color(0xFF64748B), fontSize = 10.sp)
        }
        TextButton(onClick = onApprove, colors = ButtonDefaults.textButtonColors(contentColor = Color(0xFF10B981))) { Text("✓", fontSize = 14.sp) }
        TextButton(onClick = onReject, colors = ButtonDefaults.textButtonColors(contentColor = Color(0xFFEF4444))) { Text("✗", fontSize = 14.sp) }
    }
}

@Composable
fun OrgApprovalCard(org: Organization, onApprove: () -> Unit, onReject: () -> Unit) {
    val statusColor = when (org.status) { "Approved" -> Color(0xFF10B981); "Rejected" -> Color(0xFFEF4444); else -> Color(0xFFF59E0B) }
    Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, statusColor.copy(0.2f)), modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Business, null, tint = Color(0xFF3B82F6), modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(org.name, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                Text(org.status, color = statusColor, fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }
            Text(org.email, color = Color(0xFF64748B), fontSize = 10.sp, modifier = Modifier.padding(top = 4.dp))
            if (org.status == "Pending") {
                Spacer(modifier = Modifier.height(12.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Button(onClick = onApprove, modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))) { Text("APPROVE", fontSize = 11.sp) }
                    Button(onClick = onReject, modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444))) { Text("REJECT", fontSize = 11.sp) }
                }
            }
        }
    }
}

// ── Admin Users ────────────────────────────────────────────────────────────────
@Composable
fun AdminUsersScreen() {
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp)) {
        Text("USER MANAGEMENT", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(16.dp))
        EmptyDataPlaceholder("No users found")
    }
}

// ── Admin Audit Logs ───────────────────────────────────────────────────────────
@Composable
fun AdminAuditScreen(vm: AdminViewModel = hiltViewModel()) {
    val logs by vm.auditLogs.collectAsState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617))) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("AUDIT LOGS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Text("${logs.size} events recorded", color = Color(0xFF64748B), fontSize = 11.sp)
        }
        if (logs.isEmpty()) EmptyDataPlaceholder("No audit logs found")
        else {
            LazyColumn(contentPadding = PaddingValues(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(logs) { log ->
                    Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()) {
                        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.History, null, tint = Color(0xFF3B82F6), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(10.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(log.action, color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                Text("Resource: ${log.resource}", color = Color(0xFF64748B), fontSize = 9.sp)
                            }
                            Text(log.timestamp.take(10), color = Color(0xFF475569), fontSize = 9.sp)
                        }
                    }
                }
            }
        }
    }
}

// ── Admin Permissions ──────────────────────────────────────────────────────────
@Composable
fun AdminPermissionsScreen() {
    val scroll = rememberScrollState()
    val roles = listOf("Super Admin" to listOf("All permissions"), "Admin" to listOf("User management", "Org approvals", "Audit logs"),
        "Analyst" to listOf("Read dashboards", "Run simulations", "View suppliers"),
        "Viewer" to listOf("Read-only access", "View dashboards"))

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("PERMISSIONS MANAGEMENT", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)

        roles.forEach { (role, perms) ->
            DashboardSection(role.uppercase()) {
                perms.forEach { perm ->
                    Row(modifier = Modifier.padding(vertical = 4.dp)) {
                        Icon(Icons.Default.Check, null, tint = Color(0xFF10B981), modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(perm, color = Color(0xFF94A3B8), fontSize = 11.sp)
                    }
                }
            }
        }
    }
}

// ── Admin Database Monitor ─────────────────────────────────────────────────────
@Composable
fun AdminDatabaseScreen() {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("DATABASE MONITORING", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("DB Status", "Online", Color(0xFF10B981), Modifier.weight(1f))
            KpiCard("Latency", "12ms", Color(0xFF3B82F6), Modifier.weight(1f))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("Storage Used", "2.1 GB", Color(0xFFF59E0B), Modifier.weight(1f))
            KpiCard("Active Conns", "847", Color(0xFFA855F7), Modifier.weight(1f))
        }

        DashboardSection("TABLE STATISTICS") {
            listOf("suppliers" to 1284, "alerts" to 342, "organizations" to 87,
                "audit_logs" to 15234, "simulations" to 234, "edges" to 3821).forEach { (table, rows) ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                    Text(table, color = Color(0xFF3B82F6), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                    Text("$rows rows", color = Color.Gray, fontSize = 10.sp)
                }
                Divider(color = Color.White.copy(0.04f))
            }
        }
    }
}

// ── Admin API Monitor ──────────────────────────────────────────────────────────
@Composable
fun AdminApiScreen() {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("API MONITORING", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("API Status", "Healthy", Color(0xFF10B981), Modifier.weight(1f))
            KpiCard("Uptime", "99.97%", Color(0xFF10B981), Modifier.weight(1f))
        }
        DashboardSection("ENDPOINT HEALTH") {
            listOf("/api/suppliers" to "98.2ms", "/api/alerts" to "45ms", "/api/simulations" to "234ms",
                "/api/analytics" to "112ms", "/api/auth" to "32ms").forEach { (endpoint, latency) ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                    Text(endpoint, color = Color(0xFF3B82F6), fontSize = 10.sp, modifier = Modifier.weight(1f))
                    Text("✓", color = Color(0xFF10B981), fontSize = 10.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(latency, color = Color.Gray, fontSize = 10.sp)
                }
            }
        }
    }
}

// ── Admin Disaster Feed ────────────────────────────────────────────────────────
@Composable
fun AdminDisasterFeedScreen() {
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp)) {
        Text("DISASTER FEED MANAGEMENT", color = Color(0xFFEF4444), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Configure disaster data sources", color = Color(0xFF64748B), fontSize = 11.sp)
        Spacer(modifier = Modifier.height(16.dp))

        DashboardSection("ACTIVE DATA SOURCES") {
            listOf("USGS Earthquake Feed" to true, "NOAA Weather API" to true, "ReliefWeb Disaster DB" to true,
                "GDACSmobile" to false, "GDELT Project" to true).forEach { (source, active) ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text(source, color = Color.White, fontSize = 11.sp, modifier = Modifier.weight(1f))
                    Switch(checked = active, onCheckedChange = {},
                        colors = SwitchDefaults.colors(checkedTrackColor = Color(0xFF3B82F6)))
                }
            }
        }
    }
}

// ── Admin System Monitoring ────────────────────────────────────────────────────
@Composable
fun AdminSystemScreen() {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("SYSTEM MONITORING", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("CPU Usage", "23%", Color(0xFF10B981), Modifier.weight(1f))
            KpiCard("Memory", "6.2 GB", Color(0xFF3B82F6), Modifier.weight(1f))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            KpiCard("Disk I/O", "142 MB/s", Color(0xFFF59E0B), Modifier.weight(1f))
            KpiCard("Network", "1.2 Gbps", Color(0xFFA855F7), Modifier.weight(1f))
        }

        DashboardSection("SERVICE STATUS") {
            listOf("Web Server" to "Running", "Database" to "Running", "Cache (Redis)" to "Running",
                "Message Queue" to "Running", "AI Engine" to "Running", "Scheduler" to "Running").forEach { (service, status) ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(8.dp).background(Color(0xFF10B981), RoundedCornerShape(4.dp)))
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(service, color = Color.White, fontSize = 11.sp, modifier = Modifier.weight(1f))
                    Text(status, color = Color(0xFF10B981), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

