package com.globalchain.data.models

data class Supplier(
    val id: String = "",
    val companyId: String? = null,
    val name: String = "",
    val tierLevel: Int = 1,
    val lat: Double = 0.0,
    val lng: Double = 0.0,
    val region: String? = null,
    val country: String? = null,
    val city: String? = null,
    val riskScore: Double = 0.0,
    val healthScore: Double = 100.0,
    val qualityScore: Double = 100.0,
    val resilienceScore: Double = 100.0,
    val visibilityScope: String = "public",
    val category: String? = null,
    val isBackup: Boolean = false,
    val dependsOn: String? = null,
    val createdAt: String = "",
    val updatedAt: String = ""
)

data class Organization(
    val id: String = "",
    val name: String = "",
    val email: String = "",
    val status: String = "Pending",
    val createdAt: String = ""
)

data class SimulationConfig(
    val id: String = "",
    val type: String = "Disaster",
    val locationName: String = "Global",
    val severity: String = "Medium",
    val radius: Int = 800,
    val duration: String = "1 Month",
    val lat: Double? = null,
    val lng: Double? = null,
    val timestamp: String = ""
)

data class SimulationResult(
    val config: SimulationConfig,
    val totalAffected: Int = 0,
    val financialLoss: Double = 0.0,
    val resilienceScore: Int = 0,
    val logisticsDelay: String = "",
    val affectedSuppliers: List<AffectedSupplier> = emptyList(),
    val recommendations: List<SimulationRecommendation> = emptyList(),
    val simulatedSuppliers: List<Supplier> = emptyList()
)

data class AffectedSupplier(
    val name: String,
    val health: Int,
    val tier: Int,
    val reason: String
)

data class SimulationRecommendation(
    val backupName: String,
    val reason: String,
    val riskReduction: Int,
    val logisticsImprovement: Int,
    val representative: String = "",
    val email: String = "",
    val phone: String = ""
)

data class Alert(
    val id: String = "",
    val title: String = "",
    val severity: String = "Medium",
    val description: String = "",
    val category: String = "",
    val timestamp: String = "",
    val resolved: Boolean = false
)

data class UserProfile(
    val id: String = "",
    val email: String = "",
    val fullName: String = "",
    val role: String = "Viewer",
    val orgName: String = "",
    val createdAt: String = ""
)

data class AuditLog(
    val id: String = "",
    val action: String = "",
    val userId: String = "",
    val resource: String = "",
    val timestamp: String = ""
)

data class AnalyticsStat(
    val label: String,
    val value: String,
    val change: Double = 0.0,
    val positive: Boolean = true
)
