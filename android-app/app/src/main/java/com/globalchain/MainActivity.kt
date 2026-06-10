package com.globalchain

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.globalchain.navigation.NavGraph
import com.globalchain.navigation.Screen
import com.globalchain.ui.screens.auth.AuthViewModel
import com.globalchain.ui.screens.auth.SessionState
import com.globalchain.ui.theme.GlobalChainTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GlobalChainTheme {
                MainApp()
            }
        }
    }
}

// Routes where the bottom nav bar should NOT be shown
private val NO_BOTTOM_BAR_ROUTES = setOf(
    Screen.Login.route, Screen.Signup.route, Screen.ForgotPassword.route,
    Screen.AdminLogin.route, Screen.AdminDashboard.route, Screen.AdminOrgs.route,
    Screen.AdminUsers.route, Screen.AdminAudit.route, Screen.AdminPermissions.route,
    Screen.AdminDatabase.route, Screen.AdminApi.route, Screen.AdminDisasterFeed.route,
    Screen.AdminSystem.route
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainApp() {
    // SAFE LAUNCH MODE
    // Bypasses NavGraph, Session Checking, Realtime, and Maps entirely.
    val authViewModel: AuthViewModel = hiltViewModel()
    
    Scaffold(containerColor = Color(0xFF020617)) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding).fillMaxSize().background(Color(0xFF020617))) {
            com.globalchain.ui.screens.auth.LoginScreen(
                onNavigateToHome = {},
                onNavigateToAdminHome = {},
                onNavigateToSignup = {},
                onNavigateToForgotPassword = {},
                viewModel = authViewModel
            )
        }
    }
}

@Composable
fun SplashScreen() {
    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF020617)),
        contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            CircularProgressIndicator(color = Color(0xFF3B82F6), modifier = Modifier.size(40.dp))
            Spacer(modifier = Modifier.height(16.dp))
            Text("GLOBALCHAIN", color = Color.White, fontSize = 20.sp,
                fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
            Text("Verifying session...", color = Color(0xFF64748B), fontSize = 12.sp)
        }
    }
}

@Composable
fun BottomNavBar(navController: NavHostController, currentRoute: String?) {
    NavigationBar(containerColor = Color(0xFF0F172A), contentColor = Color.White) {
        val items = listOf(
            NavItem("Home", Screen.Home, Icons.Default.Home),
            NavItem("Suppliers", Screen.Suppliers, Icons.Default.Group),
            NavItem("Map", Screen.GeoMap, Icons.Default.Map),
            NavItem("Analytics", Screen.Analytics, Icons.Default.BarChart),
            NavItem("Alerts", Screen.Alerts, Icons.Default.Notifications),
        )
        items.forEach { item ->
            NavigationBarItem(
                icon = { Icon(item.icon, contentDescription = item.label, modifier = Modifier.size(22.dp)) },
                label = { Text(item.label, fontSize = 9.sp) },
                selected = currentRoute == item.screen.route,
                onClick = {
                    navController.navigate(item.screen.route) {
                        popUpTo(Screen.Home.route) { saveState = true }
                        launchSingleTop = true
                        restoreState = true
                    }
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = Color(0xFF3B82F6),
                    unselectedIconColor = Color(0xFF475569),
                    selectedTextColor = Color(0xFF3B82F6),
                    unselectedTextColor = Color(0xFF475569),
                    indicatorColor = Color(0xFF3B82F6).copy(alpha = 0.12f)
                )
            )
        }
    }
}

data class NavItem(val label: String, val screen: Screen, val icon: androidx.compose.ui.graphics.vector.ImageVector)
