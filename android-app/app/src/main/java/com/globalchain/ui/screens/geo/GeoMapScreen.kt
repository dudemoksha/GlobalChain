package com.globalchain.ui.screens.geo

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.navigation.NavController
import com.globalchain.data.models.Supplier
import com.globalchain.navigation.Screen
import com.globalchain.ui.screens.dashboard.EmptyDataPlaceholder
import com.globalchain.ui.viewmodel.SupplierViewModel
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GeoMapScreen(
    navController: NavController,
    vm: SupplierViewModel = hiltViewModel()
) {
    val suppliers by vm.suppliers.collectAsState()
    val loading by vm.loading.collectAsState()

    // Filter controls
    var showTier1 by remember { mutableStateOf(true) }
    var showTier2 by remember { mutableStateOf(true) }
    var showTier3 by remember { mutableStateOf(true) }
    var showBackups by remember { mutableStateOf(true) }
    var selectedSupplier by remember { mutableStateOf<Supplier?>(null) }

    // Default camera: world center
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(LatLng(20.0, 0.0), 2f)
    }

    val filteredSuppliers = suppliers.filter { s ->
        when {
            s.isBackup -> showBackups
            s.tierLevel == 1 -> showTier1
            s.tierLevel == 2 -> showTier2
            s.tierLevel == 3 -> showTier3
            else -> true
        }
    }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF020617))) {

        // Header
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("GEO INTELLIGENCE MAP", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                Text("${filteredSuppliers.size} nodes visible · ${suppliers.size} total", color = Color(0xFF64748B), fontSize = 10.sp)
            }
            IconButton(onClick = { navController.navigate(Screen.DataUpload.route) }) {
                Icon(Icons.Default.Upload, null, tint = Color(0xFF3B82F6))
            }
        }

        // Tier filter chips
        Row(
            modifier = Modifier.padding(horizontal = 16.dp).fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            FilterChip(selected = showTier1, onClick = { showTier1 = !showTier1 },
                label = { Text("T1", fontSize = 10.sp) },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = Color(0xFF3B82F6), selectedLabelColor = Color.White))
            FilterChip(selected = showTier2, onClick = { showTier2 = !showTier2 },
                label = { Text("T2", fontSize = 10.sp) },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = Color(0xFF10B981), selectedLabelColor = Color.White))
            FilterChip(selected = showTier3, onClick = { showTier3 = !showTier3 },
                label = { Text("T3", fontSize = 10.sp) },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = Color(0xFFF59E0B), selectedLabelColor = Color.White))
            FilterChip(selected = showBackups, onClick = { showBackups = !showBackups },
                label = { Text("Backup", fontSize = 10.sp) },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = Color(0xFFA855F7), selectedLabelColor = Color.White))

            Spacer(modifier = Modifier.weight(1f))

            // Legend
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(modifier = Modifier.size(8.dp).background(Color(0xFF10B981), RoundedCornerShape(4.dp)))
                Text(" Healthy", color = Color(0xFF64748B), fontSize = 9.sp)
                Spacer(modifier = Modifier.width(6.dp))
                Box(modifier = Modifier.size(8.dp).background(Color(0xFFEF4444), RoundedCornerShape(4.dp)))
                Text(" Risk", color = Color(0xFF64748B), fontSize = 9.sp)
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        if (loading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Color(0xFF3B82F6))
            }
        } else if (suppliers.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                EmptyDataPlaceholder("No supplier coordinates available.\nUpload a dataset with Lat/Lng columns to plot nodes on the map.")
            }
        } else {
            Box(modifier = Modifier.weight(1f)) {
                GoogleMap(
                    modifier = Modifier.fillMaxSize(),
                    cameraPositionState = cameraPositionState,
                    properties = MapProperties(mapType = MapType.NORMAL),
                    uiSettings = MapUiSettings(zoomControlsEnabled = true, compassEnabled = true)
                ) {
                    filteredSuppliers.forEach { supplier ->
                        if (supplier.lat != 0.0 || supplier.lng != 0.0) {
                            val pos = LatLng(supplier.lat, supplier.lng)
                            val hue = when {
                                supplier.isBackup -> BitmapDescriptorFactory.HUE_VIOLET
                                supplier.healthScore < 40 -> BitmapDescriptorFactory.HUE_RED
                                supplier.healthScore < 70 -> BitmapDescriptorFactory.HUE_YELLOW
                                supplier.tierLevel == 1 -> BitmapDescriptorFactory.HUE_BLUE
                                supplier.tierLevel == 2 -> BitmapDescriptorFactory.HUE_GREEN
                                else -> BitmapDescriptorFactory.HUE_CYAN
                            }
                            Marker(
                                state = MarkerState(position = pos),
                                title = supplier.name,
                                snippet = "Tier ${supplier.tierLevel} · Health: ${supplier.healthScore.toInt()}% · Risk: ${supplier.riskScore.toInt()}",
                                icon = BitmapDescriptorFactory.defaultMarker(hue),
                                onClick = {
                                    selectedSupplier = supplier
                                    false
                                }
                            )
                        }
                    }
                }

                // Selected supplier detail card
                selectedSupplier?.let { s ->
                    val healthColor = when {
                        s.healthScore < 40 -> Color(0xFFEF4444)
                        s.healthScore < 70 -> Color(0xFFF59E0B)
                        else -> Color(0xFF10B981)
                    }
                    Card(
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .padding(16.dp)
                            .fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
                        shape = RoundedCornerShape(16.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, healthColor.copy(0.4f))
                    ) {
                        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(s.name, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                Text("Tier ${s.tierLevel} · ${s.country ?: s.region ?: "Unknown"}",
                                    color = Color(0xFF64748B), fontSize = 11.sp)
                                Spacer(modifier = Modifier.height(6.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                    Text("Health: ${s.healthScore.toInt()}%", color = healthColor, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    Text("Risk: ${s.riskScore.toInt()}", color = if (s.riskScore > 70) Color(0xFFEF4444) else Color(0xFFF59E0B), fontSize = 11.sp)
                                    if (s.isBackup) Text("BACKUP", color = Color(0xFFA855F7), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                IconButton(onClick = {
                                    navController.navigate("supplier_details/${s.id}")
                                }) {
                                    Icon(Icons.Default.OpenInNew, null, tint = Color(0xFF3B82F6))
                                }
                                IconButton(onClick = { selectedSupplier = null }) {
                                    Icon(Icons.Default.Close, null, tint = Color(0xFF64748B))
                                }
                            }
                        }
                    }
                }
            }
        }

        // Stats bar
        Row(
            modifier = Modifier.fillMaxWidth().background(Color(0xFF0F172A)).padding(10.dp),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            MapStatItem("Total", suppliers.size.toString(), Color(0xFF3B82F6))
            MapStatItem("Tier 1", suppliers.count { it.tierLevel == 1 && !it.isBackup }.toString(), Color(0xFF3B82F6))
            MapStatItem("Tier 2", suppliers.count { it.tierLevel == 2 && !it.isBackup }.toString(), Color(0xFF10B981))
            MapStatItem("Tier 3", suppliers.count { it.tierLevel == 3 && !it.isBackup }.toString(), Color(0xFFF59E0B))
            MapStatItem("High Risk", suppliers.count { it.riskScore > 70 }.toString(), Color(0xFFEF4444))
        }
    }
}

@Composable
private fun MapStatItem(label: String, value: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, color = color, fontSize = 14.sp, fontWeight = FontWeight.Bold)
        Text(label, color = Color(0xFF64748B), fontSize = 9.sp)
    }
}
