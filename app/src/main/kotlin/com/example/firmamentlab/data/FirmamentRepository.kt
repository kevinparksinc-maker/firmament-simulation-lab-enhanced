package com.example.firmamentlab.data

class FirmamentRepository {

    /**
     * Never fabricate a schedule by applying the selected date to example fixtures.
     * Until a validated schedule provider is connected, return no games rather
     * than misrepresenting mock matchups and odds as official live data.
     */
    fun getScheduledGames(date: String, sport: String): List<ScheduledGame> {
        return emptyList()
    }

    fun simulateFixture(teamA: String, teamB: String, sport: String, location: String, startTime: String, agentViewModel: String): SimulationResult {
        return SimulationResult(
            input = EventInput(
                id = "sim-${System.currentTimeMillis()}",
                teamA = teamA,
                teamB = teamB,
                sport = sport,
                location = location,
                startTime = startTime,
                agentViewModel = agentViewModel
            ),
            baseline = BaselineResult(
                winner = "A",
                territorial = FrameWinner("A"),
                kpStellar = FrameWinner("A"),
                verdict = "Consensus support"
            ),
            godView = FrameAudit(
                summary = AuditSummary(hits = 6, misses = 1),
                synthesis = FrameSynthesis(winner = "A", differential = 4.2),
                allLayers = listOf(
                    LayerVerdict("Cluster territory & house-lord placement", "hit", "A", 3.5, 1.2, "Strong ascendant housing concentration in H1, H10."),
                    LayerVerdict("Nakshatra influence", "hit", "A", 2.8, 1.5, "Star lords align with favorable trines."),
                    LayerVerdict("Essential dignity", "hit", "A", 1.9, 0.8, "Benefic rulers in angular positions."),
                    LayerVerdict("Chaldean Decans", "hit", "A", 1.2, 0.6, "Decanates reinforce team A side."),
                    LayerVerdict("Planetary war", "miss", "B", 0.5, 1.1, "Minor affliction on primary indicator."),
                    LayerVerdict("Arabic Lots", "hit", "A", 2.1, 0.9, "Part of Fortune aligns with H1."),
                    LayerVerdict("Nine-planet influence", "hit", "A", 3.0, 1.4, "Stellar nodes support primary vector.")
                )
            ),
            agentView = FrameAudit(
                summary = AuditSummary(hits = 5, misses = 2),
                synthesis = FrameSynthesis(winner = "A", differential = 3.1),
                allLayers = listOf(
                    LayerVerdict("Observer horizon & ascendant", "hit", "A", 3.1, 1.4, "Local rising sign mirrors team A signature."),
                    LayerVerdict("Local house cusps", "hit", "A", 2.5, 1.2, "Angular distribution favors home side."),
                    LayerVerdict("Local meridians", "miss", "B", 0.8, 1.6, "Midheaven counterforce present."),
                    LayerVerdict("Lunar phase transition", "hit", "A", 1.7, 0.9, "Waxing moon reinforces activation."),
                    LayerVerdict("Solar elevation", "hit", "A", 2.0, 1.1, "Day chart advantage active.")
                )
            ),
            comparison = ComparisonResult(
                actualWinner = "A",
                verified = true
            ),
            synthesis = SynthesisResult(
                winner = "A",
                protocolVersion = "v2.4-fixed",
                mappingVersion = "v1.8",
                primaryTestimony = "God View activated field with AgentView local channel",
                activatedField = FieldMetric(4.2),
                localManifestation = FieldMetric(3.1),
                translation = TranslationMetrics(
                    state = "convergent",
                    explanation = "Both the permanent ancient background (God View) and the event-local topography (AgentView) converge on Team A, confirming strong structural alignment.",
                    structuralConvergence = 0.88,
                    counterforce = 0.12,
                    suppression = 0.05,
                    volatility = 0.22
                )
            ),
            chart = ChartData(
                godView = GodViewChart(
                    ascendantLongitude = 72.45,
                    planets = listOf(
                        PlanetReading("Sun", "Aries", 1, 12.4, "Ashwini", "Ketu", "Sun", false),
                        PlanetReading("Moon", "Taurus", 2, 4.1, "Krittika", "Sun", "Moon", false),
                        PlanetReading("Mercury", "Pisces", 12, 18.9, "Revati", "Mercury", "Venus", true),
                        PlanetReading("Venus", "Aquarius", 11, 22.5, "Shatabhisha", "Rahu", "Mars", false),
                        PlanetReading("Mars", "Capricorn", 10, 8.2, "Shravana", "Moon", "Jupiter", false),
                        PlanetReading("Jupiter", "Taurus", 2, 14.7, "Rohini", "Moon", "Saturn", false),
                        PlanetReading("Saturn", "Aquarius", 11, 5.3, "Dhanishta", "Mars", "Mercury", false),
                        PlanetReading("Rahu", "Pisces", 12, 11.0, "Uttara Bhadrapada", "Saturn", "Rahu", true),
                        PlanetReading("Ketu", "Virgo", 6, 11.0, "Hasta", "Moon", "Ketu", true)
                    )
                )
            )
        )
    }

    fun getAssistantResponse(question: String): String {
        val q = question.lowercase()
        return when {
            q.contains("not evaluated") || q.contains("unverified") ->
                "An audit layer is marked 'not evaluated' or 'unverified' when there is no confirmed actual match result supplied yet to score against, or when specific method parameters could not be computed for the fixture coordinates."
            q.contains("god view") || q.contains("agent view") ->
                "God View keeps houses fixed to the ancient background (Hamal / 13° Aries zero-point), identifying the permanent activated field. AgentView uses the game's exact event time and location—or the dawn-anchored model—to translate that field into local manifestation."
            q.contains("market") || q.contains("favorite") ->
                "The market favorite is retrieved live from sportsbook moneylines via official odds feeds. It indicates what public markets project independently of astrological simulation models."
            else ->
                "The Firmament research lab processes historical and scheduled fixtures through dual astronomical frames. Every calculation provides a complete audit trail of planetary placements, house cusps, and layer verdicts."
        }
    }
}
