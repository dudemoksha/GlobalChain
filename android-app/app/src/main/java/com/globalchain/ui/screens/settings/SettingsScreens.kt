@file:OptIn(ExperimentalMaterial3Api::class)
package com.globalchain.ui.screens.settings

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
import androidx.navigation.NavController
import com.globalchain.navigation.Screen

// ── Settings Hub ───────────────────────────────────────────────────────────────
@Composable
fun SettingsScreen(navController: NavController) {
    val scroll = rememberScrollState()
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("SETTINGS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Application configuration & preferences", color = Color(0xFF64748B), fontSize = 11.sp)
        Spacer(modifier = Modifier.height(8.dp))

        SettingsGroup("ACCOUNT") {
            SettingsRow("General Settings", Icons.Default.Settings, Color(0xFF3B82F6)) { navController.navigate(Screen.SettingsGeneral.route) }
            SettingsRow("Data Retention", Icons.Default.Storage, Color(0xFF10B981)) { navController.navigate(Screen.SettingsRetention.route) }
        }

        SettingsGroup("ADMIN") {
            SettingsRow("Admin Portal", Icons.Default.AdminPanelSettings, Color(0xFFEF4444)) { navController.navigate(Screen.AdminDashboard.route) }
            SettingsRow("User Management", Icons.Default.Group, Color(0xFFA855F7)) { navController.navigate(Screen.AdminUsers.route) }
            SettingsRow("Permissions", Icons.Default.Lock, Color(0xFFF59E0B)) { navController.navigate(Screen.AdminPermissions.route) }
            SettingsRow("Audit Logs", Icons.Default.History, Color(0xFF06B6D4)) { navController.navigate(Screen.AdminAudit.route) }
        }

        SettingsGroup("SYSTEM") {
            SettingsRow("System Monitoring", Icons.Default.Monitor, Color(0xFF14B8A6)) { navController.navigate(Screen.AdminSystem.route) }
            SettingsRow("Database Monitor", Icons.Default.DataUsage, Color(0xFF3B82F6)) { navController.navigate(Screen.AdminDatabase.route) }
            SettingsRow("API Monitoring", Icons.Default.Api, Color(0xFF10B981)) { navController.navigate(Screen.AdminApi.route) }
        }

        // App Info
        Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Text("GlobalChain Enterprise", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                Text("Version 1.0.0 • Native Android", color = Color(0xFF64748B), fontSize = 11.sp)
                Text("Supabase: zvraaxqalrgfstubdmjz", color = Color(0xFF3B82F6), fontSize = 9.sp, modifier = Modifier.padding(top = 4.dp))
            }
        }
    }
}

@Composable
fun SettingsGroup(title: String, content: @Composable ColumnScope.() -> Unit) {
    Column {
        Text(title, color = Color(0xFF64748B), fontSize = 9.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(vertical = 6.dp, horizontal = 4.dp))
        Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()) {
            Column { content() }
        }
    }
}

@Composable
fun SettingsRow(label: String, icon: ImageVector, color: Color, onClick: () -> Unit) {
    Row(modifier = Modifier.fillMaxWidth().clickable { onClick() }.padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically) {
        Box(modifier = Modifier.size(32.dp).background(color.copy(0.15f), RoundedCornerShape(8.dp)), contentAlignment = Alignment.Center) {
            Icon(icon, null, tint = color, modifier = Modifier.size(16.dp))
        }
        Spacer(modifier = Modifier.width(12.dp))
        Text(label, color = Color.White, fontSize = 13.sp, modifier = Modifier.weight(1f))
        Icon(Icons.Default.ChevronRight, null, tint = Color(0xFF475569), modifier = Modifier.size(16.dp))
    }
}

// ── General Settings ───────────────────────────────────────────────────────────
@Composable
fun GeneralSettingsScreen() {
    var notifications by remember { mutableStateOf(true) }
    var darkMode by remember { mutableStateOf(true) }
    var realtimeSync by remember { mutableStateOf(true) }
    var autoRefresh by remember { mutableStateOf(false) }
    var language by remember { mutableStateOf("English") }
    val scroll = rememberScrollState()

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("GENERAL SETTINGS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)

        Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(12.dp)) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                SettingsToggle("Push Notifications", "Receive supply chain alerts", notifications) { notifications = it }
                Divider(color = Color.White.copy(0.05f))
                SettingsToggle("Dark Mode", "Always use dark theme", darkMode) { darkMode = it }
                Divider(color = Color.White.copy(0.05f))
                SettingsToggle("Realtime Sync", "Live Supabase data sync", realtimeSync) { realtimeSync = it }
                Divider(color = Color.White.copy(0.05f))
                SettingsToggle("Auto Refresh", "Refresh dashboards every 30s", autoRefresh) { autoRefresh = it }
            }
        }

        Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(12.dp)) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("LANGUAGE", color = Color(0xFF64748B), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("English", "Spanish", "French").forEach { lang ->
                        FilterChip(selected = language == lang, onClick = { language = lang },
                            label = { Text(lang, fontSize = 11.sp) },
                            colors = FilterChipDefaults.filterChipColors(selectedContainerColor = Color(0xFF3B82F6), selectedLabelColor = Color.White))
                    }
                }
            }
        }
    }
}

@Composable
fun SettingsToggle(title: String, subtitle: String, checked: Boolean, onChange: (Boolean) -> Unit) {
    Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Column(modifier = Modifier.weight(1f)) {
            Text(title, color = Color.White, fontSize = 13.sp)
            Text(subtitle, color = Color(0xFF64748B), fontSize = 10.sp)
        }
        Switch(checked = checked, onCheckedChange = onChange,
            colors = SwitchDefaults.colors(checkedTrackColor = Color(0xFF3B82F6), checkedThumbColor = Color.White))
    }
}

// ── Data Retention Settings ────────────────────────────────────────────────────
@Composable
fun RetentionSettingsScreen() {
    var alertRetention by remember { mutableFloatStateOf(90f) }
    var simRetention by remember { mutableFloatStateOf(180f) }
    var auditRetention by remember { mutableFloatStateOf(365f) }
    val scroll = rememberScrollState()

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)).padding(16.dp).verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("DATA RETENTION", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Configure how long data is retained in the system", color = Color(0xFF64748B), fontSize = 11.sp)

        Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)), shape = RoundedCornerShape(12.dp)) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
                RetentionSlider("Alert History", alertRetention, { alertRetention = it }, Color(0xFFF59E0B))
                Divider(color = Color.White.copy(0.05f))
                RetentionSlider("Simulation History", simRetention, { simRetention = it }, Color(0xFF3B82F6))
                Divider(color = Color.White.copy(0.05f))
                RetentionSlider("Audit Logs", auditRetention, { auditRetention = it }, Color(0xFFA855F7))
            }
        }

        Button(onClick = {}, modifier = Modifier.fillMaxWidth().height(50.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B82F6))) {
            Text("SAVE RETENTION POLICY", fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun RetentionSlider(label: String, value: Float, onChange: (Float) -> Unit, color: Color) {
    Column {
        Row(modifier = Modifier.fillMaxWidth()) {
            Text(label, color = Color.Gray, fontSize = 11.sp, modifier = Modifier.weight(1f))
            Text("${value.toInt()} days", color = color, fontSize = 11.sp, fontWeight = FontWeight.Bold)
        }
        Slider(value = value, onValueChange = onChange, valueRange = 30f..365f,
            colors = SliderDefaults.colors(thumbColor = color, activeTrackColor = color))
    }
}
