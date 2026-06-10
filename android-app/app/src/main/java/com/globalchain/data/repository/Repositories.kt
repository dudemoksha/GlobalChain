package com.globalchain.data.repository

import com.globalchain.data.models.*
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.gotrue.auth
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SupplierRepository @Inject constructor(private val supabase: SupabaseClient) {

    suspend fun getSuppliers(): List<Supplier> {
        return try {
            val userId = supabase.auth.currentUserOrNull()?.id ?: return emptyList()
            supabase.postgrest["suppliers"]
                .select(Columns.ALL)
                .decodeList<SupplierDto>()
                .map { it.toModel() }
        } catch (e: Exception) { emptyList() }
    }

    suspend fun addSupplier(supplier: Supplier): Boolean = try {
        supabase.postgrest["suppliers"].insert(supplier.toDto())
        true
    } catch (e: Exception) { false }

    suspend fun deleteSupplier(id: String): Boolean = try {
        supabase.postgrest["suppliers"].delete { filter { eq("id", id) } }
        true
    } catch (e: Exception) { false }

    suspend fun updateSupplier(supplier: Supplier): Boolean = try {
        supabase.postgrest["suppliers"].update(supplier.toDto()) { filter { eq("id", supplier.id) } }
        true
    } catch (e: Exception) { false }
}

@Singleton
class AlertsRepository @Inject constructor(private val supabase: SupabaseClient) {
    suspend fun getAlerts(): List<Alert> = try {
        supabase.postgrest["alerts"]
            .select(Columns.ALL)
            .decodeList<AlertDto>()
            .map { it.toModel() }
    } catch (e: Exception) { emptyList() }
}

@Singleton
class OrganizationRepository @Inject constructor(private val supabase: SupabaseClient) {
    suspend fun getPendingOrgs(): List<Organization> = try {
        supabase.postgrest["organizations"]
            .select(Columns.ALL) { filter { eq("status", "Pending") } }
            .decodeList<OrgDto>()
            .map { it.toModel() }
    } catch (e: Exception) { emptyList() }

    suspend fun approveOrg(id: String): Boolean = try {
        supabase.postgrest["organizations"]
            .update(buildJsonObject { put("status", "Approved") }) { filter { eq("id", id) } }
        true
    } catch (e: Exception) { false }

    suspend fun rejectOrg(id: String): Boolean = try {
        supabase.postgrest["organizations"]
            .update(buildJsonObject { put("status", "Rejected") }) { filter { eq("id", id) } }
        true
    } catch (e: Exception) { false }
}

@Singleton
class AuditRepository @Inject constructor(private val supabase: SupabaseClient) {
    suspend fun getAuditLogs(): List<AuditLog> = try {
        supabase.postgrest["audit_logs"]
            .select(Columns.ALL)
            .decodeList<AuditLogDto>()
            .map { it.toModel() }
    } catch (e: Exception) { emptyList() }
}

// DTOs - internal mapping layer
@kotlinx.serialization.Serializable
data class SupplierDto(
    val id: String = "", val name: String = "", val tier_level: Int = 1,
    val lat: Double = 0.0, val lng: Double = 0.0, val region: String? = null,
    val country: String? = null, val city: String? = null,
    val risk_score: Double = 0.0, val health_score: Double = 100.0,
    val quality_score: Double = 100.0, val resilience_score: Double = 100.0,
    val category: String? = null, val is_backup: Boolean = false,
    val created_at: String = "", val updated_at: String = ""
) {
    fun toModel() = Supplier(id, null, name, tier_level, lat, lng, region, country, city,
        risk_score, health_score, quality_score, resilience_score, "public", category, is_backup, created_at, updated_at)
}

fun Supplier.toDto() = SupplierDto(id, name, tierLevel, lat, lng, region, country, city,
    riskScore, healthScore, qualityScore, resilienceScore, category, isBackup, createdAt, updatedAt)

@kotlinx.serialization.Serializable
data class AlertDto(
    val id: String = "", val title: String = "", val severity: String = "Medium",
    val description: String = "", val category: String = "",
    val timestamp: String = "", val resolved: Boolean = false
) { fun toModel() = Alert(id, title, severity, description, category, timestamp, resolved) }

@kotlinx.serialization.Serializable
data class OrgDto(
    val id: String = "", val name: String = "", val email: String = "",
    val status: String = "Pending", val created_at: String = ""
) { fun toModel() = Organization(id, name, email, status, created_at) }

@kotlinx.serialization.Serializable
data class AuditLogDto(
    val id: String = "", val action: String = "", val user_id: String = "",
    val resource: String = "", val timestamp: String = ""
) { fun toModel() = AuditLog(id, action, user_id, resource, timestamp) }
