package com.globalchain.ui.screens.auth

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
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
import com.globalchain.ui.theme.GlassBackground
import com.globalchain.ui.theme.GlassBorder
import com.globalchain.ui.theme.PrimaryBlue

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    onNavigateToHome: () -> Unit,
    onNavigateToAdminHome: () -> Unit = {},
    onNavigateToSignup: () -> Unit,
    onNavigateToForgotPassword: () -> Unit = {},
    viewModel: AuthViewModel = hiltViewModel()
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    val authState by viewModel.authState.collectAsState()
    val context = LocalContext.current

    LaunchedEffect(authState) {
        when (authState) {
            is AuthState.Success -> {
                val role = (authState as AuthState.Success).role
                if (role == "admin" || role == "super_admin") onNavigateToAdminHome()
                else onNavigateToHome()
                viewModel.resetState()
            }
            is AuthState.AdminSuccess -> {
                onNavigateToAdminHome()
                viewModel.resetState()
            }
            is AuthState.PendingApproval -> {
                // Keep toast for pending as it's a success path before nav
                Toast.makeText(context,
                    "Registration submitted. Your account is pending admin approval. You will be notified once approved.",
                    Toast.LENGTH_LONG).show()
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
            modifier = Modifier.fillMaxWidth(0.9f).padding(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF3B82F6).copy(0.3f))
        ) {
            Column(
                modifier = Modifier.padding(28.dp).fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("GLOBALCHAIN", style = MaterialTheme.typography.headlineMedium,
                    color = Color.White, fontWeight = FontWeight.Bold)
                Text("Enterprise Supply Chain Command Center",
                    style = MaterialTheme.typography.bodySmall, color = Color(0xFF64748B),
                    modifier = Modifier.padding(bottom = 28.dp))

                OutlinedTextField(
                    value = email, onValueChange = { email = it },
                    label = { Text("Work Email") },
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryBlue, unfocusedBorderColor = GlassBorder,
                        focusedTextColor = Color.White, unfocusedTextColor = Color.White)
                )
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedTextField(
                    value = password, onValueChange = { password = it },
                    label = { Text("Password") },
                    visualTransformation = PasswordVisualTransformation(),
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryBlue, unfocusedBorderColor = GlassBorder,
                        focusedTextColor = Color.White, unfocusedTextColor = Color.White)
                )

                Spacer(modifier = Modifier.height(8.dp))
                TextButton(
                    onClick = {
                        if (email.isNotBlank()) {
                            viewModel.forgotPassword(email)
                        } else {
                            // Local toast just for simple client-side empty string validation
                            Toast.makeText(context, "Please enter your email first", Toast.LENGTH_SHORT).show()
                        }
                    },
                    modifier = Modifier.align(Alignment.End)
                ) { Text("Forgot Password?", color = Color(0xFF3B82F6), fontSize = 12.sp) }

                if (authState is AuthState.PasswordResetSent) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Password reset email sent.",
                        color = Color.Green,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }

                if (authState is AuthState.Error) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = (authState as AuthState.Error).message,
                        color = Color.Red,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = { viewModel.login(email, password) },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B82F6)),
                    enabled = authState !is AuthState.Loading && email.isNotBlank() && password.isNotBlank()
                ) {
                    if (authState is AuthState.Loading) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(22.dp))
                    } else {
                        Text("ACCESS PLATFORM", fontWeight = FontWeight.Bold)
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
                TextButton(onClick = onNavigateToSignup) {
                    Text("Register Organization / Request Access", color = Color(0xFF64748B), fontSize = 12.sp)
                }
            }
        }
    }
}
