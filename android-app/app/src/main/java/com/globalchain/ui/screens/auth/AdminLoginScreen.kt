package com.globalchain.ui.screens.auth

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminLoginScreen(
    onNavigateToAdmin: () -> Unit,
    onNavigateBack: () -> Unit,
    viewModel: AuthViewModel = hiltViewModel()
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val authState by viewModel.authState.collectAsState()
    val context = LocalContext.current

    LaunchedEffect(authState) {
        when (authState) {
            is AuthState.AdminSuccess -> {
                onNavigateToAdmin()
                viewModel.resetState()
            }
            is AuthState.Error -> {
                Toast.makeText(context, (authState as AuthState.Error).message, Toast.LENGTH_LONG).show()
                viewModel.resetState()
            }
            else -> {}
        }
    }

    Box(
        modifier = Modifier.fillMaxSize().background(Color(0xFF020617)),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(0.9f),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEF4444).copy(alpha = 0.4f))
        ) {
            Column(
                modifier = Modifier.padding(28.dp).fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("⚡ ADMIN PORTAL", style = MaterialTheme.typography.headlineMedium,
                    color = Color(0xFFEF4444), fontWeight = FontWeight.Bold)
                Text("Restricted Access — Super Admin Only",
                    style = MaterialTheme.typography.bodySmall, color = Color(0xFF64748B),
                    modifier = Modifier.padding(bottom = 8.dp))

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFEF4444).copy(0.07f)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEF4444).copy(0.25f)),
                    shape = RoundedCornerShape(10.dp), modifier = Modifier.fillMaxWidth().padding(bottom = 20.dp)
                ) {
                    Text("🔒 Admin accounts are verified against role = 'admin' in the profiles table.",
                        color = Color(0xFFEF4444), fontSize = 10.sp, modifier = Modifier.padding(12.dp))
                }

                val fc = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFFEF4444), unfocusedBorderColor = Color.White.copy(0.1f),
                    focusedTextColor = Color.White, unfocusedTextColor = Color.White)

                OutlinedTextField(value = email, onValueChange = { email = it },
                    label = { Text("Admin Email") }, modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email), colors = fc)
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedTextField(value = password, onValueChange = { password = it },
                    label = { Text("Admin Password") }, modifier = Modifier.fillMaxWidth(),
                    visualTransformation = PasswordVisualTransformation(), colors = fc)
                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = { viewModel.adminLogin(email, password) },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444)),
                    enabled = authState !is AuthState.Loading && email.isNotBlank() && password.isNotBlank()
                ) {
                    if (authState is AuthState.Loading) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(22.dp))
                    } else {
                        Text("ACCESS ADMIN PORTAL", fontWeight = FontWeight.Bold)
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
                TextButton(onClick = onNavigateBack) { Text("← Back to Login", color = Color(0xFF64748B)) }
            }
        }
    }
}
