package com.globalchain.ui.screens.auth

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Email
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ForgotPasswordScreen(
    onNavigateBack: () -> Unit,
    viewModel: AuthViewModel = hiltViewModel()
) {
    var email by remember { mutableStateOf("") }
    val authState by viewModel.authState.collectAsState()
    val context = LocalContext.current
    var sent by remember { mutableStateOf(false) }

    LaunchedEffect(authState) {
        when (authState) {
            is AuthState.PasswordResetSent -> {
                sent = true
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
            modifier = Modifier.fillMaxWidth(0.9f).padding(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFF59E0B).copy(0.3f))
        ) {
            Column(
                modifier = Modifier.padding(28.dp).fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(Icons.Default.Email, null, tint = Color(0xFFF59E0B), modifier = Modifier.size(48.dp))
                Spacer(modifier = Modifier.height(12.dp))
                Text("FORGOT PASSWORD", color = Color.White,
                    style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Text("Enter your email to receive a password reset link.",
                    color = Color(0xFF64748B), fontSize = 12.sp,
                    modifier = Modifier.padding(bottom = 24.dp))

                if (sent) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF10B981).copy(0.1f)),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF10B981).copy(0.4f)),
                        shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("✅ Reset email sent!", color = Color(0xFF10B981), fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("Check your inbox at $email. Click the link to reset your password.",
                                color = Color(0xFF94A3B8), fontSize = 11.sp)
                        }
                    }
                    Spacer(modifier = Modifier.height(20.dp))
                    Button(
                        onClick = onNavigateBack,
                        modifier = Modifier.fillMaxWidth().height(50.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B82F6))
                    ) { Text("BACK TO LOGIN", fontWeight = FontWeight.Bold) }
                } else {
                    OutlinedTextField(
                        value = email, onValueChange = { email = it },
                        label = { Text("Registered Email") },
                        modifier = Modifier.fillMaxWidth(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFFF59E0B), unfocusedBorderColor = Color.White.copy(0.1f),
                            focusedTextColor = Color.White, unfocusedTextColor = Color.White)
                    )
                    Spacer(modifier = Modifier.height(20.dp))
                    Button(
                        onClick = { viewModel.forgotPassword(email) },
                        modifier = Modifier.fillMaxWidth().height(52.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF59E0B)),
                        enabled = authState !is AuthState.Loading && email.isNotBlank()
                    ) {
                        if (authState is AuthState.Loading) {
                            CircularProgressIndicator(color = Color.White, modifier = Modifier.size(22.dp))
                        } else {
                            Text("SEND RESET LINK", fontWeight = FontWeight.Bold, color = Color.Black)
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    TextButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, null, tint = Color(0xFF64748B), modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Back to Login", color = Color(0xFF64748B), fontSize = 12.sp)
                    }
                }
            }
        }
    }
}
