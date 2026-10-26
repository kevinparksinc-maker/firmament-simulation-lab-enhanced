package com.firmament.simulation.wheel

/**
 * Shared visual contract for the Simulation Lab's celestial wheel.
 * Coordinates must already be converted to a verified stellar reference frame.
 * Never rotate a chart silently or invent a fixed 24-degree offset.
 */
data class CelestialPoint(
    val id: String,
    val glyph: String,
    val label: String,
    val longitude: Double,
    val kind: String = "planet"
)

data class CelestialAspect(
    val fromId: String,
    val toId: String,
    val type: String
)

data class CelestialWheelData(
    val referenceFrame: String,
    val points: List<CelestialPoint>,
    val aspects: List<CelestialAspect> = emptyList(),
    val houseCusps: List<Double> = emptyList()
) {
    init { require(houseCusps.isEmpty() || houseCusps.size == 12) }
}

data class ElementalDecan(val sign: String, val number: Int, val familySign: String)

object CelestialWheelMath {
    val signs = listOf("Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces")
    private val families = listOf(
        listOf("Aries","Leo","Sagittarius"),
        listOf("Taurus","Virgo","Capricorn"),
        listOf("Gemini","Libra","Aquarius"),
        listOf("Cancer","Scorpio","Pisces")
    )
    fun normalize(degrees: Double): Double = ((degrees % 360.0) + 360.0) % 360.0
    fun decan(longitude: Double): ElementalDecan {
        val angle = normalize(longitude)
        val sign = signs[(angle / 30).toInt()]
        val number = ((angle % 30) / 10).toInt()
        val family = families.first { sign in it }
        return ElementalDecan(sign, number + 1, family[(family.indexOf(sign) + number) % 3])
    }
    fun separation(a: Double, b: Double): Double {
        val delta = kotlin.math.abs(normalize(a) - normalize(b))
        return minOf(delta, 360.0 - delta)
    }
}
