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
fun SignupScreen(
    onNavigateBack: () -> Unit,
    onNavigateToHome: () -> Unit,
    viewModel: AuthViewModel = hiltViewModel()
) {
    var orgName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }

    val authState by viewModel.authState.collectAsState()
    val context = LocalContext.current

    LaunchedEffect(authState) {
        when (authState) {
            is AuthState.PendingApproval -> {
                Toast.makeText(context,
                    "✅ Registration submitted! Your organization is pending admin approval. You'll receive an email once approved.",
                    Toast.LENGTH_LONG).show()
                viewModel.resetState()
                onNavigateBack()
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
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF10B981).copy(0.3f))
        ) {
            Column(
                modifier = Modifier.padding(28.dp).fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("REGISTER ORGANIZATION", color = Color.White,
                    style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Text("Your account will be reviewed by an admin before activation.",
                    color = Color(0xFF64748B), fontSize = 11.sp,
                    modifier = Modifier.padding(bottom = 24.dp))

                // Info banner
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF10B981).copy(0.08f)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF10B981).copy(0.3f)),
                    shape = RoundedCornerShape(10.dp), modifier = Modifier.fillMaxWidth()
                ) {
                    Text("⏳ New organizations enter a Pending Approval queue. Admin must approve before login is granted.",
                        color = Color(0xFF10B981), fontSize = 10.sp, modifier = Modifier.padding(12.dp))
                }

                Spacer(modifier = Modifier.height(20.dp))

                val fieldColors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF10B981), unfocusedBorderColor = Color.White.copy(0.1f),
                    focusedTextColor = Color.White, unfocusedTextColor = Color.White)

                OutlinedTextField(value = orgName, onValueChange = { orgName = it },
                    label = { Text("Organization Name") }, modifier = Modifier.fillMaxWidth(), colors = fieldColors)
                Spacer(modifier = Modifier.height(10.dp))
                OutlinedTextField(value = email, onValueChange = { email = it },
                    label = { Text("Work Email") }, modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email), colors = fieldColors)
                Spacer(modifier = Modifier.height(10.dp))
                OutlinedTextField(value = password, onValueChange = { password = it },
                    label = { Text("Password") }, modifier = Modifier.fillMaxWidth(),
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password), colors = fieldColors)
                Spacer(modifier = Modifier.height(10.dp))
                OutlinedTextField(value = confirmPassword, onValueChange = { confirmPassword = it },
                    label = { Text("Confirm Password") }, modifier = Modifier.fillMaxWidth(),
                    visualTransformation = PasswordVisualTransformation(),
                    isError = confirmPassword.isNotEmpty() && password != confirmPassword,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password), colors = fieldColors)
                if (confirmPassword.isNotEmpty() && password != confirmPassword) {
                    Text("Passwords do not match", color = Color(0xFFEF4444), fontSize = 10.sp,
                        modifier = Modifier.align(Alignment.Start))
                }

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = {
                        when {
                            orgName.isBlank() -> Toast.makeText(context, "Enter organization name", Toast.LENGTH_SHORT).show()
                            email.isBlank() -> Toast.makeText(context, "Enter email", Toast.LENGTH_SHORT).show()
                            password.length < 6 -> Toast.makeText(context, "Password must be at least 6 characters", Toast.LENGTH_SHORT).show()
                            password != confirmPassword -> Toast.makeText(context, "Passwords do not match", Toast.LENGTH_SHORT).show()
                            else -> viewModel.signup(email, password, orgName)
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                    enabled = authState !is AuthState.Loading
                ) {
                    if (authState is AuthState.Loading) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(22.dp))
                    } else {
                        Text("SUBMIT REGISTRATION", fontWeight = FontWeight.Bold)
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
                TextButton(onClick = onNavigateBack) {
                    Text("Already have an account? Login", color = Color(0xFF64748B), fontSize = 12.sp)
                }
            }
        }
    }
}
