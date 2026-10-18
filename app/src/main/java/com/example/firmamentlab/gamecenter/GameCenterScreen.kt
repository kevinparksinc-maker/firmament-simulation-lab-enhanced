package com.example.firmamentlab.gamecenter

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/** A single canonical input type for quick games, daily slates, and historical imports.
 * This screen never fabricates predictions: the host must supply the real engine callback.
 */
data class GameInput(
    val sport: String,
    val date: String,
    val localTime: String,
    val awayTeam: String,
    val homeTeam: String,
    val favorite: String,
    val venue: String = "",
    val externalId: String = ""
) {
    fun validate(): String? = when {
        sport.isBlank() -> "Choose a sport"
        !Regex("\\d{4}-\\d{2}-\\d{2}").matches(date) ||
            runCatching { java.time.LocalDate.parse(date) }.isFailure -> "Date must be YYYY-MM-DD"
        !Regex("([01]\\d|2[0-3]):[0-5]\\d").matches(localTime) -> "Time must be HH:mm (24-hour, venue local)"
        awayTeam.isBlank() || homeTeam.isBlank() -> "Enter both teams"
        awayTeam.equals(homeTeam, ignoreCase = true) -> "Teams must be different"
        favorite != awayTeam && favorite != homeTeam -> "Select the sportsbook favorite"
        else -> null
    }
}

data class GameRunStatus(val id: String, val state: String, val detail: String = "")

/** Pure CSV parser for imported historical fixtures. Quoted commas and doubled quotes supported.
 * Header: sport,date,localTime,awayTeam,homeTeam,favorite,venue,externalId
 */
object GameImport {
    private fun fields(line: String): List<String> {
        val out = mutableListOf<String>()
        val cell = StringBuilder()
        var quoted = false
        var i = 0
        while (i < line.length) {
            val ch = line[i]
            when {
                ch == '"' && quoted && i + 1 < line.length && line[i + 1] == '"' -> {
                    cell.append('"'); i++
                }
                ch == '"' -> quoted = !quoted
                ch == ',' && !quoted -> { out.add(cell.toString().trim()); cell.clear() }
                else -> cell.append(ch)
            }
            i++
        }
        require(!quoted) { "Unclosed quote" }
        out.add(cell.toString().trim())
        return out
    }
    fun parse(csv: String, maxGames: Int = 10250): List<GameInput> {
        val lines = csv.lineSequence().filter { it.isNotBlank() }.toList()
        require(lines.isNotEmpty()) { "CSV is empty" }
        val header = fields(lines.first()).map { it.lowercase() }
        val required = listOf("sport", "date", "localtime", "awayteam", "hometeam", "favorite")
        require(required.all { it in header }) { "Missing required CSV columns" }
        require(lines.size - 1 <= maxGames) { "Batch exceeds $maxGames games" }
        fun get(row: List<String>, name: String) =
            header.indexOf(name).takeIf { it >= 0 }?.let { row.getOrElse(it) { "" } } ?: ""
        return lines.drop(1).mapIndexed { index, line ->
            val row = fields(line)
            val game = GameInput(
                get(row, "sport"), get(row, "date"), get(row, "localtime"),
                get(row, "awayteam"), get(row, "hometeam"), get(row, "favorite"),
                get(row, "venue"), get(row, "externalid")
            )
            require(game.validate() == null) { "CSV row ${index + 2}: ${game.validate()}" }
            game
        }
    }
}

/** Host app supplies scheduled games and a real simulation submission callback.
 * Batch persistence/progress belong in the repository's engine and storage layer.
 */
@Composable
fun GameCenterScreen(
    scheduledGames: List<GameInput>,
    onRunGames: (List<GameInput>) -> Unit,
    modifier: Modifier = Modifier
) {
    var tab by remember { mutableIntStateOf(0) }
    var sport by remember { mutableStateOf("NFL") }
    var date by remember { mutableStateOf("") }
    var time by remember { mutableStateOf("") }
    var away by remember { mutableStateOf("") }
    var home by remember { mutableStateOf("") }
    var favorite by remember { mutableStateOf("") }
    var venue by remember { mutableStateOf("") }
    var csv by remember { mutableStateOf("") }
    var error by remember { mutableStateOf<String?>(null) }
    var imported by remember { mutableStateOf<List<GameInput>>(emptyList()) }
    val selected = remember { mutableStateListOf<String>() }
    val tabs = listOf("Single game", "Today's slate", "Historical batch")
    Column(modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("GAME CENTER", style = MaterialTheme.typography.headlineMedium)
        Text("One game or 10,250 — the same simulation engine.")
        ScrollableTabRow(selectedTabIndex = tab) {
            tabs.forEachIndexed { index, title ->
                Tab(selected = tab == index, onClick = { tab = index }, text = { Text(title) })
            }
        }
        error?.let { Text(it, color = MaterialTheme.colorScheme.error) }
        when (tab) {
            0 -> {
                OutlinedTextField(sport, { sport = it }, label = { Text("Sport") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(date, { date = it }, label = { Text("Date YYYY-MM-DD") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(time, { time = it }, label = { Text("Venue local kickoff HH:mm") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(away, { away = it }, label = { Text("Away team") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(home, { home = it }, label = { Text("Home team") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(favorite, { favorite = it }, label = { Text("Sportsbook favorite (exact team name)") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(venue, { venue = it }, label = { Text("Venue (optional)") }, modifier = Modifier.fillMaxWidth())
                Button(onClick = {
                    val game = GameInput(sport, date, time, away.trim(), home.trim(), favorite.trim(), venue)
                    error = game.validate()
                    if (error == null) onRunGames(listOf(game))
                }, modifier = Modifier.fillMaxWidth()) { Text("▶ RUN ONE GAME") }
            }
            1 -> {
                Text("Select games from the host app's schedule feed.")
                Button(onClick = {
                    selected.clear()
                    selected.addAll(scheduledGames.indices.map(Int::toString))
                }, enabled = scheduledGames.isNotEmpty()) { Text("Select all") }
                LazyColumn(modifier = Modifier.heightIn(max = 360.dp)) {
                    items(scheduledGames.indices.toList()) { index ->
                        val game = scheduledGames[index]
                        val key = index.toString()
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Checkbox(checked = key in selected, onCheckedChange = {
                                if (it) selected.add(key) else selected.remove(key)
                            })
                            Text("${game.awayTeam} @ ${game.homeTeam} • ${game.date} ${game.localTime}")
                        }
                    }
                }
                Button(onClick = {
                    val games = scheduledGames.filterIndexed { i, _ -> i.toString() in selected }
                    error = games.firstNotNullOfOrNull { it.validate() }
                    if (error == null && games.isNotEmpty()) onRunGames(games)
                }, enabled = selected.isNotEmpty()) { Text("▶ RUN ${selected.size} SELECTED") }
            }
            else -> {
                Text("Paste CSV: sport,date,localTime,awayTeam,homeTeam,favorite,venue,externalId")
                OutlinedTextField(csv, { csv = it }, label = { Text("Historical games CSV") },
                    minLines = 5, modifier = Modifier.fillMaxWidth())
                Button(onClick = {
                    try {
                        imported = GameImport.parse(csv)
                        error = null
                    } catch (e: IllegalArgumentException) {
                        imported = emptyList()
                        error = e.message ?: "Invalid CSV"
                    }
                }) { Text("Validate import") }
                Text("${imported.size} validated games (maximum 10,250)")
                Button(onClick = { onRunGames(imported) },
                    enabled = imported.isNotEmpty()) { Text("▶ SUBMIT HISTORICAL BATCH") }
                Text("The host must persist batches, prevent duplicates, and resume interrupted runs.")
            }
        }
    }
}
