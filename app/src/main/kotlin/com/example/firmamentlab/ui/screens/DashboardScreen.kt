package com.example.firmamentlab.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.default.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.firmamentlab.data.ScheduledGame
import com.example.firmamentlab.ui.theme.*
import java.time.LocalDate

@Composable
fun DashboardScreen(
    scheduledGames: List<ScheduledGame>,
    onRunSimulation: (teamA: String, teamB: String, sport: String, location: String, startTime: String) -> Unit,
    onNavigateToChat: () -> Unit,
    isLoading: Boolean
) {
    var selectedSport by remember { mutableStateOf("ALL") }
    var selectedDate by remember { mutableStateOf(LocalDate.now().toString()) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // App Title & Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Surface(
                        modifier = Modifier.size(36.dp),
                        color = PrimaryCyan.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(10.dp),
                        border = BorderStroke(1.dp, PrimaryCyan.copy(alpha = 0.3f))
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.Star, contentDescription = null, tint = PrimaryCyan, modifier = Modifier.size(20.dp))
                        }
                    }
                    Column {
                        Text(text = "Firmament Lab", color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        Text(text = "SIMULATION LAB · SHELL V0.2", color = PrimaryCyan, fontSize = 9.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.2.sp)
                    }
                }

                IconButton(
                    onClick = onNavigateToChat,
                    modifier = Modifier.background(CardDarkHover, RoundedCornerShape(10.dp))
                ) {
                    Icon(Icons.Default.Chat, contentDescription = "AI Assistant", tint = PrimaryCyan)
                }
            }
        }

        // Quick Start Banner
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardDark),
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(1.dp, PrimaryCyan.copy(alpha = 0.3f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Surface(color = PrimaryCyan.copy(alpha = 0.2f), shape = RoundedCornerShape(6.dp)) {
                            Text(text = "START HERE", modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp), color = PrimaryCyan, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                        Text(text = "Check the market first", color = TextPrimary, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                    Text(
                        text = "Choose a scheduled game below or run an instant simulation test comparing God View and AgentView frames.",
                        color = TextSecondary,
                        fontSize = 12.sp,
                        lineHeight = 18.sp
                    )
                    Button(
                        onClick = { onRunSimulation("New York Yankees", "Houston Astros", "MLB", "Houston, TX", "2024-04-02T00:10:00Z") },
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryCyan),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.PlayArrow, contentDescription = null, tint = BackgroundDark)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = if (isLoading) "Running Simulation..." else "Run Instant Yankees vs Astros Test", color = BackgroundDark, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }
            }
        }

        // Stats Grid
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                StatCardMini(Icons.Default.Storage, "Historical", "3,932", "3 templates", Modifier.weight(1f))
                StatCardMini(Icons.Default.CheckCircle, "Accuracy", "54.7%", "MLB 2024", Modifier.weight(1f))
            }
        }

        // Market Favorite Lookup (Schedules)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardDark),
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(1.dp, BorderColor),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = "MARKET FAVORITE LOOKUP", color = PrimaryCyan, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.2.sp)
                            Text(text = "Verified game schedule", color = TextPrimary, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                        }
                        Surface(color = SuccessGreen.copy(alpha = 0.15f), shape = RoundedCornerShape(99.dp)) {
                            Text(text = "${scheduledGames.size} games", modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp), color = SuccessGreen, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    // Sport filter row
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        listOf("ALL", "MLB", "NBA", "NFL").forEach { sport ->
                            FilterChip(
                                selected = selectedSport == sport,
                                onClick = { selectedSport = sport },
                                label = { Text(sport, fontSize = 11.sp) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = PrimaryCyan.copy(alpha = 0.2f),
                                    selectedLabelColor = PrimaryCyan
                                )
                            )
                        }
                    }

                    Divider(color = BorderColor)

                    // Games list
                    if (scheduledGames.isEmpty()) {
                        Text(text = "Schedule unavailable: no verified live schedule provider is connected. No matchups will be invented.", color = TextSecondary, fontSize = 12.sp, modifier = Modifier.padding(vertical = 16.dp))
                    } else {
                        scheduledGames.filter { selectedSport == "ALL" || it.sport.equals(selectedSport, ignoreCase = true) }.forEach { game ->
                            GameRow(game = game, onRun = {
                                onRunSimulation(game.teamA, game.teamB, game.sport, game.location, game.startTime)
                            })
                            Spacer(modifier = Modifier.height(8.dp))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun StatCardMini(icon: ImageVector, eyebrow: string, value: string, detail: string, modifier: Modifier) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardDark),
        shape = RoundedCornerShape(14.dp),
        border = BorderStroke(1.dp, BorderColor),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(text = eyebrow.uppercase(), fontSize = 9.sp, fontWeight = FontWeight.Bold, color = TextSecondary)
                Icon(icon, contentDescription = null, tint = PrimaryCyan, modifier = Modifier.size(16.dp))
            }
            Text(text = value, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
            Text(text = detail, fontSize = 10.sp, color = TextSecondary)
        }
    }
}

@Composable
fun GameRow(game: ScheduledGame, onRun: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(CardDarkHover)
            .padding(12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                Surface(color = PrimaryCyan.copy(alpha = 0.1f), shape = RoundedCornerShape(4.dp)) {
                    Text(text = game.sport, modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp), color = PrimaryCyan, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                }
                Text(text = "${game.teamA} at ${game.teamB}", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(3.dp))
            Text(text = "${game.venue} · Fav: ${game.favoriteTeam ?: "TBD"}", color = TextSecondary, fontSize = 10.sp)
        }

        Button(
            onClick = onRun,
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryCyan.copy(alpha = 0.15f)),
            shape = RoundedCornerShape(8.dp),
            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
        ) {
            Text(text = "Analyze", color = PrimaryCyan, fontSize = 11.sp, fontWeight = FontWeight.Bold)
        }
    }
}
