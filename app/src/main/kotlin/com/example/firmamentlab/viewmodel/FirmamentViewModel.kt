package com.example.firmamentlab.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.firmamentlab.data.ChatMessage
import com.example.firmamentlab.data.FirmamentRepository
import com.example.firmamentlab.data.ScheduledGame
import com.example.firmamentlab.data.SimulationResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate

class FirmamentViewModel : ViewModel() {
    private val repository = FirmamentRepository()

    private val _scheduledGames = MutableStateFlow<List<ScheduledGame>>(emptyList())
    val scheduledGames: StateFlow<List<ScheduledGame>> = _scheduledGames.asStateFlow()

    private val _simulationResult = MutableStateFlow<SimulationResult?>(null)
    val simulationResult: StateFlow<SimulationResult?> = _simulationResult.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _agentViewModel = MutableStateFlow("astronomical")
    val agentViewModel: StateFlow<String> = _agentViewModel.asStateFlow()

    private val _chatMessages = MutableStateFlow<List<ChatMessage>>(
        listOf(ChatMessage("assistant", "You are the Firmament research assistant. Ask any question about the schedule, audit, or calculation transparency."))
    )
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    init {
        loadSchedule(LocalDate.now().toString(), "ALL")
    }

    fun loadSchedule(date: String, sport: String) {
        viewModelScope.launch {
            _scheduledGames.value = repository.getScheduledGames(date, sport)
        }
    }

    fun setAgentViewModel(model: String) {
        _agentViewModel.value = model
    }

    fun runSimulation(teamA: String = "New York Yankees", teamB: String = "Houston Astros", sport: String = "MLB", location: String = "Houston, TX", startTime: String = "2024-04-02T00:10:00Z") {
        viewModelScope.launch {
            _isLoading.value = true
            kotlinx.coroutines.delay(600) // simulate calculation time
            val result = repository.simulateFixture(teamA, teamB, sport, location, startTime, _agentViewModel.value)
            _simulationResult.value = result
            _isLoading.value = false
        }
    }

    fun clearSimulationResult() {
        _simulationResult.value = null
    }

    fun sendChatMessage(content: String) {
        viewModelScope.launch {
            val current = _chatMessages.value.toMutableList()
            current.add(ChatMessage("user", content))
            _chatMessages.value = current

            kotlinx.coroutines.delay(400)
            val reply = repository.getAssistantResponse(content)
            current.add(ChatMessage("assistant", reply))
            _chatMessages.value = current.toList()
        }
    }
}
