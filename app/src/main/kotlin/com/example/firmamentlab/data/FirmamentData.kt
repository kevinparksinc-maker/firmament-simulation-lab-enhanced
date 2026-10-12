package com.example.firmamentlab.data

data class ScheduledGame(
    val id: String,
    val sport: String,
    val teamA: String,
    val teamB: String,
    val favoriteTeam: String?,
    val underdogTeam: String?,
    val location: String,
    val venue: String,
    val startTime: String,
    val homeMoneyline: String?,
    val awayMoneyline: String?,
    val oddsProvider: String?,
    val status: String,
    val oddsUpdatedAt: String?,
    val source: String
)

data class PlanetReading(
    val planet: String,
    val sign: String,
    val house: Int,
    val degreeInHouse: Double,
    val nakshatra: String,
    val starLord: String,
    val subLord: String,
    val isRetrograde: Boolean
)

data class LayerVerdict(
    val name: String,
    val verdict: String, // "hit", "miss", "tie", "unverified"
    val winner: String, // "A", "B", "TIE"
    val scoreA: Double,
    val scoreB: Double,
    val detail: String
)

data class SimulationResult(
    val input: EventInput,
    val baseline: BaselineResult,
    val godView: FrameAudit,
    val agentView: FrameAudit,
    val comparison: ComparisonResult,
    val synthesis: SynthesisResult,
    val chart: ChartData
)

data class EventInput(
    val id: String,
    val teamA: String,
    val teamB: String,
    val sport: String,
    val location: String,
    val startTime: String,
    val agentViewModel: String
)

data class BaselineResult(
    val winner: String,
    val territorial: FrameWinner,
    val kpStellar: FrameWinner,
    val verdict: String
)

data class FrameWinner(
    val winner: String
)

data class FrameAudit(
    val summary: AuditSummary,
    val synthesis: FrameSynthesis,
    val allLayers: List<LayerVerdict>
)

data class AuditSummary(
    val hits: Int,
    val misses: Int
)

data class FrameSynthesis(
    val winner: String,
    val differential: Double
)

data class ComparisonResult(
    val actualWinner: String?,
    val verified: Boolean
)

data class SynthesisResult(
    val winner: String,
    val protocolVersion: String,
    val mappingVersion: String,
    val primaryTestimony: String,
    val activatedField: FieldMetric,
    val localManifestation: FieldMetric,
    val translation: TranslationMetrics
)

data class FieldMetric(
    val differential: Double
)

data class TranslationMetrics(
    val state: String,
    val explanation: String,
    val structuralConvergence: Double,
    val counterforce: Double,
    val suppression: Double,
    val volatility: Double
)

data class ChartData(
    val godView: GodViewChart
)

data class GodViewChart(
    val ascendantLongitude: Double,
    val planets: List<PlanetReading>
)

data class ChatMessage(
    val role: String, // "user", "assistant"
    val content: String
)
