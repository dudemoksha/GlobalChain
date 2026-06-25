package com.globalchain.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.globalchain.data.models.*
import com.globalchain.data.repository.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.UUID
import javax.inject.Inject
import kotlin.math.roundToInt

import io.github.jan.supabase.realtime.realtime
import io.github.jan.supabase.realtime.PostgresAction
import io.github.jan.supabase.realtime.channel
import io.github.jan.supabase.realtime.postgresChangeFlow

// Global session state holder to ensure data persists across all screens
// and navigation routes without requiring Activity-level ViewModel scoping.
object SessionStateHolder {
    val suppliers = MutableStateFlow<List<Supplier>>(emptyList())
    val loading = MutableStateFlow(false)
    val error = MutableStateFlow<String?>(null)
}

// ────────────────────────────────────────────────────────────────────────────────
// Supplier ViewModel
// ────────────────────────────────────────────────────────────────────────────────
@HiltViewModel
class SupplierViewModel @Inject constructor(
    private val repository: SupplierRepository,
    private val supabase: io.github.jan.supabase.SupabaseClient
) : ViewModel() {

    val suppliers: StateFlow<List<Supplier>> = SessionStateHolder.suppliers.asStateFlow()
    val loading: StateFlow<Boolean> = SessionStateHolder.loading.asStateFlow()
    val error: StateFlow<String?> = SessionStateHolder.error.asStateFlow()

    val tier1 get() = suppliers.value.filter { it.tierLevel == 1 && !it.isBackup }
    val tier2 get() = suppliers.value.filter { it.tierLevel == 2 && !it.isBackup }
    val tier3 get() = suppliers.value.filter { it.tierLevel == 3 && !it.isBackup }
    val backups get() = suppliers.value.filter { it.isBackup }
    val highRisk get() = suppliers.value.filter { it.riskScore > 70 }
    val operational get() = suppliers.value.filter { it.healthScore >= 70 }

    init {
        // Do NOT auto-load on startup — fresh session required.
        // Data is populated only through the upload workflow.
        // Realtime subscription is disabled to prevent overwriting local in-memory session.
    }

    /** Wipe all in-memory supplier data — call on logout or session end. */
    fun clearSession() {
        SessionStateHolder.suppliers.value = emptyList()
    }

    /** Set local state directly (used immediately after upload for fresh sessions) */
    fun setSuppliersLocal(list: List<Supplier>) {
        SessionStateHolder.suppliers.value = list
    }

    /** Explicit reload from Supabase — only call when user intentionally syncs from cloud. */
    fun load() = viewModelScope.launch {
        SessionStateHolder.loading.value = true
        SessionStateHolder.suppliers.value = repository.getSuppliers()
        SessionStateHolder.loading.value = false
    }

    private fun subscribeToRealtime() = viewModelScope.launch {
        try {
            val channel = supabase.channel("public:suppliers")
            val changeFlow = channel.postgresChangeFlow<PostgresAction>(schema = "public") {
                table = "suppliers"
            }
            channel.subscribe()
            
            changeFlow.collect {
                // To keep it robust, simply reload all from API when a change occurs,
                // or we could incrementally update _suppliers.value. 
                // For safety and sync, reload is best.
                load()
            }
        } catch (e: Exception) {
            // fallback to standard load if realtime fails
        }
    }

    fun delete(id: String) = viewModelScope.launch {
        repository.deleteSupplier(id)
    }

    fun add(supplier: Supplier) = viewModelScope.launch {
        repository.addSupplier(supplier)
    }

    fun update(supplier: Supplier) = viewModelScope.launch {
        repository.updateSupplier(supplier)
    }

    // Synchronous add for batch upload — returns success boolean
    suspend fun addSync(supplier: Supplier): Boolean {
        return repository.addSupplier(supplier)
    }

    suspend fun deleteAllSuppliers(): Boolean {
        return repository.deleteAllSuppliers()
    }
}

// ────────────────────────────────────────────────────────────────────────────────
// Alerts ViewModel
// ────────────────────────────────────────────────────────────────────────────────
@HiltViewModel
class AlertsViewModel @Inject constructor(
    private val repository: AlertsRepository
) : ViewModel() {

    private val _alerts = MutableStateFlow<List<Alert>>(emptyList())
    val alerts: StateFlow<List<Alert>> = _alerts.asStateFlow()

    val critical get() = _alerts.value.filter { it.severity == "Critical" }
    val unresolved get() = _alerts.value.filter { !it.resolved }

    init {
        generateAlerts()
    }

    private fun generateAlerts() {
        val suppliers = SessionStateHolder.suppliers.value
        val dynamicAlerts = mutableListOf<Alert>()
        
        suppliers.forEach { s ->
            if (s.riskScore > 70) {
                dynamicAlerts.add(Alert(id = UUID.randomUUID().toString(), title = "High Risk Supplier Detected", severity = "High", description = "Supplier ${s.name} has a risk score of ${s.riskScore}.", category = "Risk Management", resolved = false))
            }
            if (s.healthScore < 40) {
                dynamicAlerts.add(Alert(id = UUID.randomUUID().toString(), title = "Supply Chain Health Dropped", severity = "Critical", description = "${s.name}'s operational health is critical at ${s.healthScore}%. Immediate action required.", category = "Operations", resolved = false))
            }
            if (s.isBackup && s.tierLevel == 1) {
                dynamicAlerts.add(Alert(id = UUID.randomUUID().toString(), title = "New Alternative Supplier Available", severity = "Medium", description = "${s.name} is available as a Tier 1 backup.", category = "Logistics", resolved = false))
            }
        }
        
        if (suppliers.isEmpty()) {
            dynamicAlerts.add(Alert(id = UUID.randomUUID().toString(), title = "No Data", severity = "Low", description = "Upload your supply chain data to generate intelligence alerts.", category = "System", resolved = true))
        }

        _alerts.value = dynamicAlerts
    }
}

// ────────────────────────────────────────────────────────────────────────────────
// Admin / Org ViewModel
// ────────────────────────────────────────────────────────────────────────────────
@HiltViewModel
class AdminViewModel @Inject constructor(
    private val orgRepository: OrganizationRepository,
    private val auditRepository: AuditRepository
) : ViewModel() {

    private val _orgs = MutableStateFlow<List<Organization>>(emptyList())
    val orgs: StateFlow<List<Organization>> = _orgs.asStateFlow()

    private val _auditLogs = MutableStateFlow<List<AuditLog>>(emptyList())
    val auditLogs: StateFlow<List<AuditLog>> = _auditLogs.asStateFlow()

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading.asStateFlow()

    init { loadAll() }

    fun loadAll() = viewModelScope.launch {
        _loading.value = true
        _orgs.value = orgRepository.getPendingOrgs()
        _auditLogs.value = auditRepository.getAuditLogs()
        _loading.value = false
    }

    fun approve(id: String) = viewModelScope.launch {
        orgRepository.approveOrg(id)
        _orgs.value = _orgs.value.filter { it.id != id }
    }

    fun reject(id: String) = viewModelScope.launch {
        orgRepository.rejectOrg(id)
        _orgs.value = _orgs.value.filter { it.id != id }
    }
}

// ────────────────────────────────────────────────────────────────────────────────
// Simulation ViewModel
// ────────────────────────────────────────────────────────────────────────────────
@HiltViewModel
class SimulationViewModel @Inject constructor(
    private val supplierRepository: SupplierRepository
) : ViewModel() {

    private val _config = MutableStateFlow(SimulationConfig())
    val config: StateFlow<SimulationConfig> = _config.asStateFlow()

    private val _result = MutableStateFlow<SimulationResult?>(null)
    val result: StateFlow<SimulationResult?> = _result.asStateFlow()

    private val _running = MutableStateFlow(false)
    val running: StateFlow<Boolean> = _running.asStateFlow()

    private val _history = MutableStateFlow<List<SimulationResult>>(emptyList())
    val history: StateFlow<List<SimulationResult>> = _history.asStateFlow()

    fun updateConfig(config: SimulationConfig) { _config.value = config }

    fun runSimulation(suppliers: List<Supplier>) = viewModelScope.launch {
        _running.value = true
        kotlinx.coroutines.delay(2000) // Simulate processing time

        val cfg = _config.value
        val severityFactor = when (cfg.severity) {
            "Low" -> 0.15; "Medium" -> 0.35; "High" -> 0.60; "Critical" -> 0.85; else -> 0.35
        }

        val affected = mutableListOf<AffectedSupplier>()
        val simulatedNetwork = suppliers.map { s ->
            val dist = if (cfg.lat != null && cfg.lng != null) {
                Math.sqrt(Math.pow(s.lat - cfg.lat, 2.0) + Math.pow(s.lng - cfg.lng, 2.0)) * 111
            } else cfg.radius.toDouble() * 0.5

            if (dist <= cfg.radius) {
                val healthDrop = (severityFactor * 100 * (1 - dist / cfg.radius)).roundToInt()
                val newHealth = maxOf(0.0, s.healthScore - healthDrop)
                
                affected.add(AffectedSupplier(s.name, newHealth.roundToInt(), s.tierLevel, "Disrupted by ${cfg.type} in ${cfg.locationName}"))
                s.copy(healthScore = newHealth)
            } else {
                s
            }
        }

        val res = SimulationResult(
            config = cfg,
            totalAffected = affected.size,
            financialLoss = affected.size * severityFactor * 1_500_000,
            resilienceScore = maxOf(0, (100 - (severityFactor * 80)).roundToInt()),
            logisticsDelay = when (cfg.severity) { "Critical" -> "+45 days"; "High" -> "+21 days"; "Medium" -> "+10 days"; else -> "+3 days" },
            affectedSuppliers = affected,
            recommendations = generateRecommendations(affected, simulatedNetwork),
            simulatedSuppliers = simulatedNetwork
        )
        _result.value = res
        _history.value = listOf(res) + _history.value
        _running.value = false
    }

    fun clearSimulation() { _result.value = null }

    private fun generateRecommendations(affected: List<AffectedSupplier>, allSuppliers: List<Supplier>): List<SimulationRecommendation> {
        val backups = allSuppliers.filter { it.isBackup }
        if (backups.isEmpty()) return emptyList()

        return affected.filter { it.health < 40 }.take(3).mapIndexed { i, s ->
            val backup = backups[i % backups.size]
            SimulationRecommendation(
                backupName = backup.name,
                reason = "Activate emergency backup for ${s.name} — health critically degraded.",
                riskReduction = 30 + (i * 5) % 20, // Derived estimated metric
                logisticsImprovement = 15 + (i * 3) % 15, // Derived estimated metric
                representative = "Operations Contact",
                email = "ops@${backup.name.lowercase().replace(" ", "")}.com",
                phone = "On file"
            )
        }
    }
}
