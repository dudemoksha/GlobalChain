package com.globalchain.ui.screens.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.gotrue.auth
import io.github.jan.supabase.gotrue.providers.builtin.Email
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.delay
import kotlinx.serialization.Serializable
import dagger.Lazy
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val supabaseLazy: Lazy<SupabaseClient>
) : ViewModel() {

    private val supabase get() = supabaseLazy.get()

    private val _authState = MutableStateFlow<AuthState>(AuthState.Idle)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    private val _sessionState = MutableStateFlow<SessionState>(SessionState.Checking)
    val sessionState: StateFlow<SessionState> = _sessionState.asStateFlow()

    private val _userRole = MutableStateFlow<String>("user")
    val userRole: StateFlow<String> = _userRole.asStateFlow()

    init { checkSession() }

    // ── Session check on launch ──────────────────────────────────────────────
    fun checkSession() {
        viewModelScope.launch {
            try {
                // Safely resolve the client
                val supabase = supabaseLazy.get() 
                val user = supabase.auth.currentUserOrNull()
                if (user != null) {
                    fetchUserRole(user.id)
                    _sessionState.value = SessionState.LoggedIn(_userRole.value)
                } else {
                    _sessionState.value = SessionState.LoggedOut
                }
            } catch (e: Throwable) { // Catch EVERYTHING including NoClassDefFoundError
                android.util.Log.e("AuthViewModel", "Fatal startup error: ${e.message}", e)
                _sessionState.value = SessionState.LoggedOut
            }
        }
    }

    // ── Login ────────────────────────────────────────────────────────────────
    fun login(email: String, pass: String) {
        android.util.Log.d("AuthFlow", "1. Login button clicked in ViewModel")
        viewModelScope.launch {
            try {
                android.util.Log.d("AuthFlow", "2. AuthViewModel coroutine started")
                _authState.value = AuthState.Loading
                
                android.util.Log.d("AuthFlow", "3. Calling Supabase auth")
                val client = supabaseLazy.get()
                client.auth.signInWith(io.github.jan.supabase.gotrue.providers.builtin.Email) {
                    this.email = email
                    this.password = pass
                }
                android.util.Log.d("AuthFlow", "4. Supabase auth response received")
                
                val user = client.auth.currentUserOrNull()
                if (user != null) {
                    android.util.Log.d("AuthFlow", "5. User is not null, fetching role")
                    fetchUserRole(user.id)
                    android.util.Log.d("AuthFlow", "6. Role fetched, setting Success state")
                    _authState.value = AuthState.Success(_userRole.value)
                } else {
                    android.util.Log.d("AuthFlow", "5. User is null, setting Error state")
                    _authState.value = AuthState.Error("Login failed: User is null")
                }
            } catch (e: io.github.jan.supabase.exceptions.RestException) {
                android.util.Log.e("AuthFlow", "Crash intercepted: Supabase RestException", e)
                _authState.value = AuthState.Error(e.error)
            } catch (e: Exception) {
                android.util.Log.e("AuthFlow", "Crash intercepted: General Exception", e)
                _authState.value = AuthState.Error(e.message ?: "An unexpected error occurred")
            } catch (e: Throwable) {
                android.util.Log.e("AuthFlow", "Crash intercepted: Throwable", e)
                _authState.value = AuthState.Error("A critical error occurred: ${e.message}")
            } finally {
                android.util.Log.d("AuthFlow", "7. Login flow completed (finally block)")
            }
        }
    }

    // ── Admin Login (real Supabase auth + role check) ────────────────────────
    fun adminLogin(email: String, pass: String) {
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                supabase.auth.signInWith(Email) {
                    this.email = email
                    this.password = pass
                }
                val user = supabase.auth.currentUserOrNull()
                if (user != null) {
                    fetchUserRole(user.id)
                    if (_userRole.value == "admin" || _userRole.value == "super_admin") {
                        _authState.value = AuthState.AdminSuccess
                    } else {
                        supabase.auth.signOut()
                        _authState.value = AuthState.Error("Access denied. This account does not have admin privileges.")
                    }
                } else {
                    _authState.value = AuthState.Error("Admin authentication failed.")
                }
            } catch (e: Throwable) {
                _authState.value = AuthState.Error(e.message ?: "Admin login failed.")
            }
        }
    }


    // ── Signup with Org creation → Pending ──────────────────────────────────
    fun signup(email: String, pass: String, orgName: String) {
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                supabase.auth.signUpWith(Email) {
                    this.email = email
                    this.password = pass
                }
                val user = supabase.auth.currentUserOrNull()
                if (user != null) {
                    // Insert organization record with Pending status
                    try {
                        supabase.postgrest["organizations"].insert(
                            OrgInsert(
                                name = orgName.ifBlank { email.substringBefore("@") },
                                email = email,
                                user_id = user.id,
                                status = "Pending"
                            )
                        )
                    } catch (orgEx: Exception) {
                        // Org insert failed — still account created; log silently
                    }
                    // Sign out — user must wait for admin approval
                    supabase.auth.signOut()
                    _authState.value = AuthState.PendingApproval
                } else {
                    _authState.value = AuthState.Error("Account creation failed. Try again.")
                }
            } catch (e: Throwable) {
                _authState.value = AuthState.Error(
                    when {
                        e.message?.contains("already registered") == true -> "This email is already registered."
                        else -> e.message ?: "Signup failed."
                    }
                )
            }
        }
    }

    // ── Forgot Password ──────────────────────────────────────────────────────
    fun forgotPassword(email: String) {
        android.util.Log.d("AuthFlow", "Forgot Password button clicked")
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                android.util.Log.d("AuthFlow", "Calling Supabase resetPasswordForEmail")
                val client = supabaseLazy.get()
                client.auth.resetPasswordForEmail(email)
                android.util.Log.d("AuthFlow", "Reset password email sent successfully")
                _authState.value = AuthState.PasswordResetSent
            } catch (e: io.github.jan.supabase.exceptions.RestException) {
                android.util.Log.e("AuthFlow", "Crash intercepted: Supabase RestException", e)
                _authState.value = AuthState.Error(e.error)
            } catch (e: Exception) {
                android.util.Log.e("AuthFlow", "Crash intercepted: General Exception", e)
                _authState.value = AuthState.Error(e.message ?: "Failed to send reset email.")
            } catch (e: Throwable) {
                android.util.Log.e("AuthFlow", "Crash intercepted: Throwable", e)
                _authState.value = AuthState.Error("A critical error occurred: ${e.message}")
            }
        }
    }

    // ── Sign out ─────────────────────────────────────────────────────────────
    fun signOut() {
        viewModelScope.launch {
            try { supabase.auth.signOut() } catch (_: Exception) {}
            _sessionState.value = SessionState.LoggedOut
            _userRole.value = "user"
        }
    }

    fun resetState() { _authState.value = AuthState.Idle }

    // ── Helper: fetch role from profiles table ───────────────────────────────
    private suspend fun fetchUserRole(userId: String) {
        try {
            val profile = supabase.postgrest["profiles"]
                .select { filter { eq("id", userId) } }
                .decodeSingleOrNull<UserProfile>()
            _userRole.value = profile?.role ?: "user"
        } catch (_: Exception) {
            _userRole.value = "user"
        }
    }
}

// ── State classes ────────────────────────────────────────────────────────────
sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    data class Success(val role: String = "user") : AuthState()
    object AdminSuccess : AuthState()
    object PendingApproval : AuthState()
    object PasswordResetSent : AuthState()
    data class Error(val message: String) : AuthState()
}

sealed class SessionState {
    object Checking : SessionState()
    object LoggedOut : SessionState()
    data class LoggedIn(val role: String) : SessionState()
}

// ── Data classes ─────────────────────────────────────────────────────────────
@Serializable
data class UserProfile(val id: String = "", val role: String = "user", val email: String = "")

@Serializable
data class OrgInsert(
    val name: String,
    val email: String,
    val user_id: String,
    val status: String = "Pending"
)
