package com.example.firmamentlab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.default.Assessment
import androidx.compose.material.icons.default.Chat
import androidx.compose.material.icons.default.Home
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.example.firmamentlab.ui.screens.ChatScreen
import com.example.firmamentlab.ui.screens.DashboardScreen
import com.example.firmamentlab.ui.screens.SimulationResultScreen
import com.example.firmamentlab.ui.theme.FirmamentLabTheme
import com.example.firmamentlab.viewmodel.FirmamentViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: FirmamentViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FirmamentLabTheme {
                val scheduledGames by viewModel.scheduledGames.collectAsState()
                val simulationResult by viewModel.simulationResult.collectAsState()
                val isLoading by viewModel.isLoading.collectAsState()
                val chatMessages by viewModel.chatMessages.collectAsState()

                var selectedTab by remember { mutableStateOf(0) }

                Scaffold(
                    bottomBar = {
                        NavigationBar(
                            containerColor = MaterialTheme.colorScheme.surface
                        ) {
                            NavigationBarItem(
                                icon = { Icon(Icons.Default.Home, contentDescription = "Dashboard") },
                                label = { Text("Monitor") },
                                selected = selectedTab == 0 && simulationResult == null,
                                onClick = {
                                    selectedTab = 0
                                    viewModel.clearSimulationResult()
                                }
                            )
                            NavigationBarItem(
                                icon = { Icon(Icons.Default.Assessment, contentDescription = "Results") },
                                label = { Text("Audit") },
                                selected = simulationResult != null || selectedTab == 1,
                                onClick = {
                                    if (simulationResult != null) {
                                        selectedTab = 1
                                    } else {
                                        viewModel.runSimulation()
                                    }
                                }
                            )
                            NavigationBarItem(
                                icon = { Icon(Icons.Default.Chat, contentDescription = "Assistant") },
                                label = { Text("AI Lab") },
                                selected = selectedTab == 2,
                                onClick = { selectedTab = 2 }
                            )
                        }
                    }
                ) { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding)) {
                        when {
                            simulationResult != null && selectedTab != 2 -> {
                                SimulationResultScreen(
                                    result = simulationResult!!,
                                    onClose = { viewModel.clearSimulationResult() }
                                )
                            }
                            selectedTab == 2 -> {
                                ChatScreen(
                                    messages = chatMessages,
                                    onSendMessage = { viewModel.sendChatMessage(it) }
                                )
                            }
                            else -> {
                                DashboardScreen(
                                    scheduledGames = scheduledGames,
                                    onRunSimulation = { teamA, teamB, sport, location, startTime ->
                                        viewModel.runSimulation(teamA, teamB, sport, location, startTime)
                                        selectedTab = 1
                                    },
                                    onNavigateToChat = { selectedTab = 2 },
                                    isLoading = isLoading
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
