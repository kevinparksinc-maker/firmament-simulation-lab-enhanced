package com.example.firmamentlab.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryCyan,
    secondary = AccentPurple,
    background = BackgroundDark,
    surface = CardDark,
    onPrimary = BackgroundDark,
    onSecondary = BackgroundDark,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
)

@Composable
fun FirmamentLabTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
