package com.globalchain.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.globalchain.data.models.*
import com.globalchain.data.repository.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject
import kotlin.math.roundToInt

import io.github.jan.supabase.realtime.realtime
import io.github.jan.supabase.realtime.PostgresAction
import io.github.jan.supabase.realtime.channel
import io.github.jan.supabase.realtime.postgresChangeFlow

// ────────────────────────────────────────────────────────────────────────────────
// Supplier ViewModel
// ────────────────────────────────────────────────────────────────────────────────
@HiltViewModel
class SupplierViewModel @Inject constructor(
    private val repository: SupplierRepository,
    private val supabase: io.github.jan.supabase.SupabaseClient
) : ViewModel() {

    private val _suppliers = MutableStateFlow<List<Supplier>>(emptyList())
    val suppliers: StateFlow<List<Supplier>> = _suppliers.asStateFlow()

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    val tier1 get() = suppliers.value.filter { it.tierLevel == 1 && !it.isBackup }
    val tier2 get() = suppliers.value.filter { it.tierLevel == 2 && !it.isBackup }
    val tier3 get() = suppliers.value.filter { it.tierLevel == 3 && !it.isBackup }
    val backups get() = suppliers.value.filter { it.isBackup }
    val highRisk get() = suppliers.value.filter { it.riskScore > 70 }
    val operational get() = suppliers.value.filter { it.healthScore >= 70 }

    init {
        load()
        subscribeToRealtime()
    }

    fun load() = viewModelScope.launch {
        _loading.value = true
        _suppliers.value = repository.getSuppliers()
        _loading.value = false
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

    init { load() }

    fun load() = viewModelScope.launch {
        _alerts.value = repository.getAlerts()
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

        val affected = suppliers.mapNotNull { s ->
            val dist = if (cfg.lat != null && cfg.lng != null) {
                Math.sqrt(Math.pow(s.lat - cfg.lat, 2.0) + Math.pow(s.lng - cfg.lng, 2.0)) * 111
            } else cfg.radius.toDouble() * 0.5

            if (dist <= cfg.radius) {
                val healthDrop = (severityFactor * 100 * (1 - dist / cfg.radius)).roundToInt()
                val newHealth = maxOf(0.0, s.healthScore - healthDrop)
                
                // Update Supabase
                val updatedSupplier = s.copy(healthScore = newHealth)
                supplierRepository.updateSupplier(updatedSupplier)
                
                AffectedSupplier(s.name, newHealth.roundToInt(), s.tierLevel,
                    "Disruption propagation from ${cfg.locationName}. ${cfg.type} event impact detected.")
            } else null
        }

        val res = SimulationResult(
            config = cfg,
            totalAffected = affected.size,
            financialLoss = affected.size * severityFactor * 1_500_000,
            resilienceScore = maxOf(0, (100 - (severityFactor * 80)).roundToInt()),
            logisticsDelay = when (cfg.severity) { "Critical" -> "+45 days"; "High" -> "+21 days"; "Medium" -> "+10 days"; else -> "+3 days" },
            affectedSuppliers = affected,
            recommendations = generateRecommendations(affected)
        )
        _result.value = res
        _history.value = listOf(res) + _history.value
        _running.value = false
    }

    fun clearSimulation() { _result.value = null }

    private fun generateRecommendations(affected: List<AffectedSupplier>): List<SimulationRecommendation> {
        return affected.filter { it.health < 40 }.take(3).mapIndexed { i, s ->
            SimulationRecommendation(
                backupName = "Backup Supplier ${i + 1}",
                reason = "Activate emergency protocol for ${s.name} — health critically degraded.",
                riskReduction = listOf(32, 28, 41)[i],
                logisticsImprovement = listOf(18, 24, 15)[i],
                representative = "Emergency Contact ${i + 1}",
                email = "emergency${i + 1}@globalchain.io",
                phone = "+1-800-GCH-00${i + 1}"
            )
        }
    }
}
