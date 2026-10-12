package com.example.firmamentlab.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.default.Close
import androidx.compose.material.icons.default.CheckCircle
import androidx.compose.material.icons.default.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.firmamentlab.data.SimulationResult
import com.example.firmamentlab.ui.theme.*

@Composable
fun SimulationResultScreen(
    result: SimulationResult,
    onClose: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "PRIMARY SYNTHESIS",
                        color = PrimaryCyan,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.5.sp
                    )
                    Text(
                        text = "${result.input.teamA} vs ${result.input.teamB}",
                        color = TextPrimary,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                IconButton(onClick = onClose, modifier = Modifier.background(CardDarkHover, RoundedCornerShape(8.dp))) {
                    Icon(Icons.Default.Close, contentDescription = "Close", tint = TextPrimary)
                }
            }
        }

        // Game Brief Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardDark),
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(1.dp, BorderColor),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Column {
                            Text(text = "SYNTHESIZED WINNER", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = TextSecondary)
                            Text(text = "Team ${result.synthesis.winner}", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = PrimaryCyan)
                        }
                        Surface(
                            color = SuccessGreen.copy(alpha = 0.15f),
                            shape = RoundedCornerShape(99.dp),
                            border = BorderStroke(1.dp, SuccessGreen.copy(alpha = 0.3f))
                        ) {
                            Text(
                                text = result.synthesis.translation.state.uppercase(),
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                color = SuccessGreen,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Divider(color = BorderColor)

                    Text(
                        text = result.synthesis.translation.explanation,
                        fontSize = 13.sp,
                        color = TextPrimary,
                        lineHeight = 20.sp
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        MetricBox("God View", "+${result.synthesis.activatedField.differential}")
                        MetricBox("AgentView", "+${result.synthesis.localManifestation.differential}")
                        MetricBox("Convergence", "${(result.synthesis.translation.structuralConvergence * 100).toInt()}%")
                    }
                }
            }
        }

        // God View & AgentView Audit
        item {
            Text(
                text = "FRAME LAYER AUDITS",
                color = TextSecondary,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.5.sp
            )
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                AuditColumn("God View Audit", result.godView.allLayers, Modifier.weight(1f))
                AuditColumn("AgentView Audit", result.agentView.allLayers, Modifier.weight(1f))
            }
        }

        // Placements Table
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardDark),
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(1.dp, BorderColor),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "PLANETARY PLACEMENTS (${result.chart.godView.planets.size} BODIES)",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextSecondary,
                        letterSpacing = 1.2.sp
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    result.chart.godView.planets.forEach { planet ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 6.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = planet.planet, fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 13.sp)
                            Text(text = "${planet.sign} H${planet.house}", color = TextSecondary, fontSize = 12.sp)
                            Text(text = "${planet.starLord} → ${planet.subLord}", color = PrimaryCyan, fontSize = 11.sp)
                        }
                        Divider(color = BorderColor.copy(alpha = 0.5f))
                    }
                }
            }
        }
    }
}

@Composable
fun MetricBox(label: String, value: String) {
    Column(
        modifier = Modifier
            .clip(RoundedCornerShape(10.dp))
            .background(CardDarkHover)
            .padding(12.dp)
    ) {
        Text(text = label.uppercase(), fontSize = 8.sp, fontWeight = FontWeight.Bold, color = TextSecondary)
        Spacer(modifier = Modifier.height(4.dp))
        Text(text = value, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
    }
}

@Composable
fun AuditColumn(title: String, layers: List<com.example.firmamentlab.data.LayerVerdict>, modifier: Modifier) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardDark),
        shape = RoundedCornerShape(14.dp),
        border = BorderStroke(1.dp, BorderColor),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(text = title, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = PrimaryCyan)
            Divider(color = BorderColor)
            layers.forEach { layer ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = layer.name, fontSize = 11.sp, color = TextSecondary, modifier = Modifier.weight(1f))
                    Surface(
                        color = if (layer.verdict == "hit") SuccessGreen.copy(alpha = 0.15f) else ErrorRose.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            text = layer.verdict.uppercase(),
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            color = if (layer.verdict == "hit") SuccessGreen else ErrorRose,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}
