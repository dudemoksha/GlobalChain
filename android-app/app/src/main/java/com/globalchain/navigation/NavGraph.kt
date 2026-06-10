package com.globalchain.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.globalchain.ui.screens.DashboardScreen
import com.globalchain.ui.screens.ProfileScreen
import com.globalchain.ui.screens.admin.*
import com.globalchain.ui.screens.analytics.*
import com.globalchain.ui.screens.auth.*
import com.globalchain.ui.screens.dashboard.*
import com.globalchain.ui.screens.geo.GeoMapScreen
import com.globalchain.ui.screens.intelligence.*
import com.globalchain.ui.screens.settings.*
import com.globalchain.ui.screens.simulations.*
import com.globalchain.ui.screens.suppliers.*
import com.globalchain.ui.screens.upload.*

sealed class Screen(val route: String) {
    // Auth
    object Login : Screen("login")
    object Signup : Screen("signup")
    object ForgotPassword : Screen("forgot_password")
    object AdminLogin : Screen("admin_login")

    // Main Navigation
    object Home : Screen("home")
    object Profile : Screen("profile")

    // Dashboards
    object Executive : Screen("dashboard_executive")
    object Global : Screen("dashboard_global")
    object Operational : Screen("dashboard_operational")
    object Health : Screen("dashboard_health")
    object Risk : Screen("dashboard_risk")
    object Realtime : Screen("dashboard_realtime")

    // Suppliers
    object Suppliers : Screen("suppliers")
    object SupplierDetails : Screen("supplier_details/{id}")
    object AddSupplier : Screen("supplier_add")
    object EditSupplier : Screen("supplier_edit/{id}")
    object BackupSuppliers : Screen("supplier_backups")
    object SupplierHealth : Screen("supplier_health")
    object SupplierContracts : Screen("supplier_contracts")
    object SupplierTier1 : Screen("supplier_tier1")
    object SupplierTier2 : Screen("supplier_tier2")
    object SupplierTier3 : Screen("supplier_tier3")
    object DependencyMapping : Screen("dependency_mapping")

    // Geo Map
    object GeoMap : Screen("geo_map")

    // Simulations
    object Simulations : Screen("simulations")
    object SimCenter : Screen("sim_center")
    object SimDisaster : Screen("sim_disaster")
    object SimEarthquake : Screen("sim_earthquake")
    object SimFlood : Screen("sim_flood")
    object SimCyber : Screen("sim_cyber")
    object SimWar : Screen("sim_war")
    object SimPort : Screen("sim_port")
    object SimTraffic : Screen("sim_traffic")
    object SimHistory : Screen("sim_history")

    // Analytics
    object Analytics : Screen("analytics")
    object AnalyticsForecast : Screen("analytics_forecast")
    object AnalyticsFinancial : Screen("analytics_financial")
    object AnalyticsDemand : Screen("analytics_demand")
    object AnalyticsDependency : Screen("analytics_dependency")
    object AnalyticsLogistics : Screen("analytics_logistics")
    object AnalyticsInventory : Screen("analytics_inventory")
    object AnalyticsManufacturing : Screen("analytics_manufacturing")
    object AnalyticsGeopolitical : Screen("analytics_geopolitical")
    object AnalyticsCyber : Screen("analytics_cyber")
    object AnalyticsPredictive : Screen("analytics_predictive")
    object AnalyticsResilience : Screen("analytics_resilience")
    object AnalyticsMatrix : Screen("analytics_matrix")
    object AnalyticsRecovery : Screen("analytics_recovery")

    // Intelligence
    object Alerts : Screen("alerts")
    object DisasterIntel : Screen("disaster_intel")
    object DisasterFeed : Screen("disaster_feed")
    object WeatherIntel : Screen("weather_intel")
    object Recommendations : Screen("recommendations")
    object IntelModels : Screen("intel_models")
    object Timeline : Screen("timeline")
    object Reports : Screen("reports")

    // Upload / Data
    object DataUpload : Screen("data_upload")
    object CsvUpload : Screen("data_csv")
    object ExcelUpload : Screen("data_excel")
    object DataMapping : Screen("data_mapping")
    object DataValidation : Screen("data_validation")
    object DataTemplates : Screen("data_templates")
    object DataStatus : Screen("data_status")

    // Admin Portal
    object AdminDashboard : Screen("admin_dashboard")
    object AdminOrgs : Screen("admin_orgs")
    object AdminUsers : Screen("admin_users")
    object AdminAudit : Screen("admin_audit")
    object AdminPermissions : Screen("admin_permissions")
    object AdminDatabase : Screen("admin_database")
    object AdminApi : Screen("admin_api")
    object AdminDisasterFeed : Screen("admin_disaster_feed")
    object AdminSystem : Screen("admin_system")

    // Settings
    object Settings : Screen("settings")
    object SettingsGeneral : Screen("settings_general")
    object SettingsRetention : Screen("settings_retention")
    object RiskMatrix : Screen("risk_matrix")
}

@Composable
fun NavGraph(navController: NavHostController, startDestination: String = Screen.Login.route) {
    NavHost(navController = navController, startDestination = startDestination) {

        // ── Auth ──────────────────────────────────────────────────────────────
        composable(Screen.Login.route) {
            LoginScreen(
                onNavigateToHome = {
                    navController.navigate(Screen.Home.route) { popUpTo(Screen.Login.route) { inclusive = true } }
                },
                onNavigateToAdminHome = {
                    navController.navigate(Screen.AdminDashboard.route) { popUpTo(Screen.Login.route) { inclusive = true } }
                },
                onNavigateToSignup = { navController.navigate(Screen.Signup.route) },
                onNavigateToForgotPassword = { navController.navigate(Screen.ForgotPassword.route) }
            )
        }
        composable(Screen.Signup.route) {
            SignupScreen(
                onNavigateBack = { navController.popBackStack() },
                onNavigateToHome = { navController.navigate(Screen.Home.route) { popUpTo(Screen.Login.route) { inclusive = true } } }
            )
        }
        composable(Screen.ForgotPassword.route) {
            ForgotPasswordScreen(onNavigateBack = { navController.popBackStack() })
        }
        composable(Screen.AdminLogin.route) {
            AdminLoginScreen(
                onNavigateToAdmin = { navController.navigate(Screen.AdminDashboard.route) },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        // ── Core ──────────────────────────────────────────────────────────────
        composable(Screen.Home.route) {
            DashboardScreen(navController = navController)
        }
        composable(Screen.Profile.route) { ProfileScreen() }

        // ── Dashboards ────────────────────────────────────────────────────────
        composable(Screen.Executive.route) { ExecutiveDashboardScreen() }
        composable(Screen.Global.route) { GlobalDashboardScreen() }
        composable(Screen.Operational.route) { OperationalDashboardScreen() }
        composable(Screen.Health.route) { HealthDashboardScreen() }
        composable(Screen.Risk.route) { RiskDashboardScreen() }
        composable(Screen.Realtime.route) { RealtimeDashboardScreen() }

        // ── Suppliers ─────────────────────────────────────────────────────────
        composable(Screen.Suppliers.route) { SuppliersScreen(navController) }
        composable(
            Screen.SupplierDetails.route,
            arguments = listOf(navArgument("id") { type = NavType.StringType })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getString("id") ?: ""
            SupplierDetailsScreen(navController = navController, supplierId = id)
        }
        composable(Screen.AddSupplier.route) { AddEditSupplierScreen(navController, isEdit = false) }
        composable(
            Screen.EditSupplier.route,
            arguments = listOf(navArgument("id") { type = NavType.StringType })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getString("id") ?: ""
            AddEditSupplierScreen(navController, isEdit = true, supplierId = id)
        }
        composable(Screen.BackupSuppliers.route) { BackupSuppliersScreen() }
        composable(Screen.SupplierHealth.route) { SupplierHealthScreen() }
        composable(Screen.SupplierContracts.route) { SupplierContractsScreen() }
        composable(Screen.SupplierTier1.route) { TierSuppliersScreen(tier = 1) }
        composable(Screen.SupplierTier2.route) { TierSuppliersScreen(tier = 2) }
        composable(Screen.SupplierTier3.route) { TierSuppliersScreen(tier = 3) }
        composable(Screen.DependencyMapping.route) { DependencyMappingScreen() }

        // ── Geo Map ───────────────────────────────────────────────────────────
        composable(Screen.GeoMap.route) { GeoMapScreen(navController) }

        // ── Simulations ───────────────────────────────────────────────────────
        composable(Screen.SimCenter.route) { SimulationCenterScreen() }
        composable(Screen.Simulations.route) { SimulationCenterScreen() }
        composable(Screen.SimDisaster.route) { SimulationConfigScreen("Disaster") }
        composable(Screen.SimEarthquake.route) { SimulationConfigScreen("Earthquake") }
        composable(Screen.SimFlood.route) { SimulationConfigScreen("Flood") }
        composable(Screen.SimCyber.route) { SimulationConfigScreen("Cyber") }
        composable(Screen.SimWar.route) { SimulationConfigScreen("War") }
        composable(Screen.SimPort.route) { SimulationConfigScreen("Port") }
        composable(Screen.SimTraffic.route) { SimulationConfigScreen("Traffic") }
        composable(Screen.SimHistory.route) { SimulationHistoryScreen() }

        // ── Analytics ─────────────────────────────────────────────────────────
        composable(Screen.Analytics.route) { AnalyticsHubScreen(navController) }
        composable(Screen.AnalyticsForecast.route) { ForecastAnalyticsScreen() }
        composable(Screen.AnalyticsFinancial.route) { FinancialAnalyticsScreen() }
        composable(Screen.AnalyticsDemand.route) { DemandAnalyticsScreen() }
        composable(Screen.AnalyticsDependency.route) { DependencyAnalyticsScreen() }
        composable(Screen.AnalyticsLogistics.route) { LogisticsAnalyticsScreen() }
        composable(Screen.AnalyticsInventory.route) { InventoryAnalyticsScreen() }
        composable(Screen.AnalyticsManufacturing.route) { ManufacturingAnalyticsScreen() }
        composable(Screen.AnalyticsGeopolitical.route) { GeopoliticalAnalyticsScreen() }
        composable(Screen.AnalyticsCyber.route) { CyberAnalyticsScreen() }
        composable(Screen.AnalyticsPredictive.route) { PredictiveAnalyticsScreen() }
        composable(Screen.AnalyticsResilience.route) { ResilienceAnalyticsScreen() }
        composable(Screen.AnalyticsMatrix.route) { RiskMatrixScreen() }
        composable(Screen.AnalyticsRecovery.route) { RecoveryAnalyticsScreen() }

        // ── Intelligence ──────────────────────────────────────────────────────
        composable(Screen.Alerts.route) { AlertsScreen() }
        composable(Screen.DisasterIntel.route) { DisasterIntelligenceScreen() }
        composable(Screen.DisasterFeed.route) { DisasterFeedScreen() }
        composable(Screen.WeatherIntel.route) { WeatherIntelligenceScreen() }
        composable(Screen.Recommendations.route) { RecommendationCenterScreen() }
        composable(Screen.IntelModels.route) { IntelModelsScreen() }
        composable(Screen.Timeline.route) { TimelineScreen() }
        composable(Screen.Reports.route) { ReportsScreen() }

        // ── Data Upload ───────────────────────────────────────────────────────
        composable(Screen.DataUpload.route) { DataUploadHubScreen(navController) }
        composable(Screen.CsvUpload.route) { CsvUploadScreen() }
        composable(Screen.ExcelUpload.route) { ExcelUploadScreen() }
        composable(Screen.DataMapping.route) { DataMappingScreen() }
        composable(Screen.DataValidation.route) { DataValidationScreen() }
        composable(Screen.DataTemplates.route) { DataTemplatesScreen() }
        composable(Screen.DataStatus.route) { DataStatusScreen() }

        // ── Admin ─────────────────────────────────────────────────────────────
        composable(Screen.AdminDashboard.route) { AdminDashboardScreen(navController) }
        composable(Screen.AdminOrgs.route) { AdminOrgsScreen() }
        composable(Screen.AdminUsers.route) { AdminUsersScreen() }
        composable(Screen.AdminAudit.route) { AdminAuditScreen() }
        composable(Screen.AdminPermissions.route) { AdminPermissionsScreen() }
        composable(Screen.AdminDatabase.route) { AdminDatabaseScreen() }
        composable(Screen.AdminApi.route) { AdminApiScreen() }
        composable(Screen.AdminDisasterFeed.route) { AdminDisasterFeedScreen() }
        composable(Screen.AdminSystem.route) { AdminSystemScreen() }

        // ── Settings ──────────────────────────────────────────────────────────
        composable(Screen.Settings.route) { SettingsScreen(navController) }
        composable(Screen.SettingsGeneral.route) { GeneralSettingsScreen() }
        composable(Screen.SettingsRetention.route) { RetentionSettingsScreen() }
    }
}
