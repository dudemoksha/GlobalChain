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
            // No auth check — public read access
            supabase.postgrest["suppliers"]
                .select(Columns.ALL)
                .decodeList<SupplierDto>()
                .map { it.toModel() }
        } catch (e: Exception) { emptyList() }
    }

    suspend fun addSupplier(supplier: Supplier): Boolean = try {
        // Use InsertDto — omits id and timestamps so DB auto-generates them
        supabase.postgrest["suppliers"].insert(supplier.toInsertDto())
        true
    } catch (e: Exception) {
        android.util.Log.e("SupplierRepo", "Insert failed: ${e.message}", e)
        false
    }

    suspend fun deleteSupplier(id: String): Boolean = try {
        supabase.postgrest["suppliers"].delete { filter { eq("id", id) } }
        true
    } catch (e: Exception) { false }

    suspend fun deleteAllSuppliers(): Boolean = try {
        // Delete all rows where id is not null (which matches everything)
        supabase.postgrest["suppliers"].delete { filter { neq("id", "00000000-0000-0000-0000-000000000000") } }
        true
    } catch (e: Exception) { 
        android.util.Log.e("SupplierRepo", "Delete all failed: ${e.message}", e)
        false 
    }

    suspend fun updateSupplier(supplier: Supplier): Boolean = try {
        supabase.postgrest["suppliers"].update(supplier.toInsertDto()) { filter { eq("id", supplier.id) } }
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

// ── Full read DTO (includes auto-generated fields from DB) ─────────────────────
@kotlinx.serialization.Serializable
data class SupplierDto(
    val id: String = "",
    val name: String = "",
    val tier: Int = 1,
    val lat: Double = 0.0,
    val lng: Double = 0.0,
    val region: String? = null,
    val country: String? = null,
    val risk: Int = 20,        // INTEGER in schema
    val health: Int = 80,      // INTEGER in schema
    val category: String? = null,
    val is_backup: Boolean = false,
    val created_at: String = "",
    val updated_at: String = ""
) {
    fun toModel() = Supplier(
        id = id, companyId = null, name = name, tierLevel = tier,
        lat = lat, lng = lng, region = region, country = country, city = null,
        riskScore = risk.toDouble(), healthScore = health.toDouble(),
        qualityScore = health.toDouble(), resilienceScore = (100 - risk).toDouble(),
        visibilityScope = "Public", category = category, isBackup = is_backup,
        createdAt = created_at, updatedAt = updated_at
    )
}

// ── Insert DTO (omit id, created_at, updated_at — let DB auto-generate) ────────
@kotlinx.serialization.Serializable
data class SupplierInsertDto(
    val name: String,
    val tier: Int,
    val lat: Double,
    val lng: Double,
    val region: String? = null,
    val country: String? = null,
    val risk: Int = 20,
    val health: Int = 80,
    val category: String? = null,
    val is_backup: Boolean = false
)

fun Supplier.toInsertDto() = SupplierInsertDto(
    name = name,
    tier = tierLevel.coerceIn(1, 3),
    lat = lat,
    lng = lng,
    region = region,
    country = country,
    risk = riskScore.toInt().coerceIn(0, 100),
    health = healthScore.toInt().coerceIn(0, 100),
    category = category,
    is_backup = isBackup
)


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
