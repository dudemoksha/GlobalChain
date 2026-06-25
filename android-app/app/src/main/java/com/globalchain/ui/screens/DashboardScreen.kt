package com.globalchain.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.globalchain.ui.screens.dashboard.ExecutiveDashboardScreen

data class TopNavItem(val label: String, val icon: ImageVector, val route: String)

private val TOP_NAV_ITEMS = listOf(
    TopNavItem("Upload Excel", Icons.Default.Upload, Screen.ExcelUpload.route),
    TopNavItem("Dashboard", Icons.Default.Dashboard, Screen.Executive.route),
    TopNavItem("Globe View", Icons.Default.Public, Screen.VisualGlobe.route),
    TopNavItem("Simulation", Icons.Default.Science, Screen.SimCenter.route),
    TopNavItem("Analytics", Icons.Default.Analytics, Screen.Analytics.route),
    TopNavItem("Suppliers", Icons.Default.Business, Screen.Suppliers.route),
    TopNavItem("Reports", Icons.Default.Description, Screen.Reports.route),
    TopNavItem("Settings", Icons.Default.Settings, Screen.SettingsGeneral.route)
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(navController: NavController) {
    var currentRoute by remember { mutableStateOf(Screen.Executive.route) }

    Scaffold(
        containerColor = Color(0xFF020617),
        topBar = {
            Column {
                // ── Main App Bar ──────────────────────────────────────────────
                TopAppBar(
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                "GLOBALCHAIN",
                                color = Color.White,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = Color(0xFF0F172A)
                    ),
                    actions = {
                        IconButton(onClick = {
                            navController.navigate(Screen.Alerts.route)
                        }) {
                            Icon(Icons.Default.Notifications, contentDescription = "Alerts", tint = Color(0xFF64748B))
                        }
                        IconButton(onClick = {
                            navController.navigate(Screen.Profile.route)
                        }) {
                            Icon(Icons.Default.Person, contentDescription = "Profile", tint = Color(0xFF64748B))
                        }
                    }
                )

                // ── Scrollable Top Navigation Bar ──────────────────────────────
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF0A0F1E))
                        .padding(vertical = 8.dp)
                ) {
                    LazyRow(
                        modifier = Modifier.fillMaxWidth(),
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(TOP_NAV_ITEMS) { item ->
                            val isSelected = currentRoute == item.route
                            
                            Row(
                                modifier = Modifier
                                    .background(
                                        if (isSelected) Color(0xFF3B82F6).copy(alpha = 0.2f) else Color(0xFF1E293B),
                                        RoundedCornerShape(20.dp)
                                    )
                                    .clickable {
                                        currentRoute = item.route
                                        navController.navigate(item.route) {
                                            launchSingleTop = true
                                        }
                                    }
                                    .padding(horizontal = 16.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = item.icon,
                                    contentDescription = null,
                                    tint = if (isSelected) Color(0xFF3B82F6) else Color(0xFF94A3B8),
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = item.label,
                                    color = if (isSelected) Color(0xFF3B82F6) else Color(0xFF94A3B8),
                                    fontSize = 12.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                )
                            }
                        }
                    }
                }
                HorizontalDivider(color = Color.White.copy(0.06f))
            }
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding).fillMaxSize()) {
            ExecutiveDashboardScreen()
        }
    }
}

