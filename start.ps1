# D&D Session Manager - Haupt-Starter
Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase

# === Pfade ===
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$statusFile = "$env:TEMP\dnd_status.txt"
$progressFile = "$env:TEMP\dnd_progress.txt"

# === Funktion: Status updaten ===
function Update-Status {
  param($message, $progress)
  Set-Content -Path $statusFile -Value $message
  Set-Content -Path $progressFile -Value $progress
  Write-Host $message
}

# === Funktion: Prozess starten ===
function Start-Process-Hidden {
  param($FilePath, $ArgumentList, $WorkingDirectory)
    
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $FilePath
  $psi.Arguments = $ArgumentList
  $psi.WorkingDirectory = $WorkingDirectory
  $psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
  $psi.CreateNoWindow = $true
    
  return [System.Diagnostics.Process]::Start($psi)
}

# === Splash Screen starten ===
$splashJob = Start-Job -ScriptBlock {
  param($scriptPath)
  & powershell -WindowStyle Hidden -File "$scriptPath\launch.ps1"
} -ArgumentList $scriptDir

Start-Sleep -Milliseconds 500

# === Backend starten ===
Update-Status "🔥 Beschwöre Backend-Dämonen..." 15
$backendProcess = Start-Process-Hidden -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "$scriptDir\backend"
Start-Sleep -Seconds 2

# === Datenbank initialisieren ===
Update-Status "📚 Rufe Helden aus der Datenbank..." 30
Start-Sleep -Seconds 1

# === Frontend starten ===
Update-Status "⚡ Bereite Vite-Runen vor..." 50
$frontendProcess = Start-Process-Hidden -FilePath "cmd" -ArgumentList "/c npm run dev" -WorkingDirectory "$scriptDir\frontend"
Start-Sleep -Seconds 3

# === Ngrok starten (optional) ===
Update-Status "🌐 Rufe Ngrok-Geist herbei..." 70
# $ngrokProcess = Start-Process-Hidden -FilePath "ngrok" -ArgumentList "http 5173"
Start-Sleep -Seconds 2

# === Audio Setup ===
Update-Status "🎵 Stimme Musik der Tavernen ab..." 85
Start-Sleep -Seconds 1

# === Fertig ===
Update-Status "✨ Bereit, Meister Kevin!" 100
Start-Sleep -Seconds 1

# === Warte auf Splash Screen ===
Wait-Job $splashJob | Out-Null
Remove-Job $splashJob

# === Hauptfenster ===
$xaml = @"
<Window xmlns='http://schemas.microsoft.com/winfx/2006/xaml/presentation'
        xmlns:x='http://schemas.microsoft.com/winfx/2006/xaml'
        Title='D&amp;D Session Manager - Control Panel'
        WindowStartupLocation='CenterScreen'
        Width='700' Height='500'
        Background='#1a1a1a'>
    <Grid Margin='20'>
        <Grid.RowDefinitions>
            <RowDefinition Height='Auto'/>
            <RowDefinition Height='*'/>
            <RowDefinition Height='Auto'/>
        </Grid.RowDefinitions>
        
        <!-- Header -->
        <TextBlock Grid.Row='0' Text='★ D&amp;D Session Manager ★'
                   FontSize='28' Foreground='#FFAA00' FontWeight='Bold'
                   HorizontalAlignment='Center' Margin='0,0,0,20'/>
        
        <!-- Status Panel -->
        <Border Grid.Row='1' Background='#111' BorderBrush='#333' BorderThickness='1' CornerRadius='5' Padding='15'>
            <StackPanel>
                <TextBlock Text='📊 System Status' FontSize='18' Foreground='#FFAA00' Margin='0,0,0,15'/>
                
                <StackPanel Orientation='Horizontal' Margin='0,5'>
                    <TextBlock Text='Backend:' Width='120' Foreground='White'/>
                    <TextBlock x:Name='backendStatus' Text='🟢 Running' Foreground='#00FF00'/>
                </StackPanel>
                
                <StackPanel Orientation='Horizontal' Margin='0,5'>
                    <TextBlock Text='Frontend:' Width='120' Foreground='White'/>
                    <TextBlock x:Name='frontendStatus' Text='🟢 Running' Foreground='#00FF00'/>
                </StackPanel>
                
                <StackPanel Orientation='Horizontal' Margin='0,5'>
                    <TextBlock Text='Database:' Width='120' Foreground='White'/>
                    <TextBlock x:Name='dbStatus' Text='🟢 Connected' Foreground='#00FF00'/>
                </StackPanel>
                
                <Separator Margin='0,20' Background='#333'/>
                
                <TextBlock Text='🔗 Quick Links' FontSize='18' Foreground='#FFAA00' Margin='0,10,0,15'/>
                
                <Button x:Name='btnFrontend' Content='🌐 Open Frontend (localhost:5173)' 
                        Height='35' Background='#2a2a2a' Foreground='White' BorderBrush='#FFAA00'
                        Margin='0,5' Cursor='Hand'/>
                
                <Button x:Name='btnBackend' Content='⚙️ Open Backend (localhost:3000)' 
                        Height='35' Background='#2a2a2a' Foreground='White' BorderBrush='#FFAA00'
                        Margin='0,5' Cursor='Hand'/>
            </StackPanel>
        </Border>
        
        <!-- Buttons -->
        <StackPanel Grid.Row='2' Orientation='Horizontal' HorizontalAlignment='Center' Margin='0,20,0,0'>
            <Button x:Name='btnRestart' Content='🔄 Restart All' Width='120' Height='40'
                    Background='#FFAA00' Foreground='Black' FontWeight='Bold' Margin='5'/>
            <Button x:Name='btnStop' Content='⏹️ Stop All' Width='120' Height='40'
                    Background='#FF3333' Foreground='White' FontWeight='Bold' Margin='5'/>
            <Button x:Name='btnClose' Content='❌ Close Panel' Width='120' Height='40'
                    Background='#2a2a2a' Foreground='White' Margin='5'/>
        </StackPanel>
    </Grid>
</Window>
"@

$reader = New-Object System.Xml.XmlNodeReader ([xml]$xaml)
$mainWindow = [Windows.Markup.XamlReader]::Load($reader)

# === Button Events ===
$btnFrontend = $mainWindow.FindName("btnFrontend")
$btnBackend = $mainWindow.FindName("btnBackend")
$btnRestart = $mainWindow.FindName("btnRestart")
$btnStop = $mainWindow.FindName("btnStop")
$btnClose = $mainWindow.FindName("btnClose")

$btnFrontend.Add_Click({ Start-Process "http://localhost:5173" })
$btnBackend.Add_Click({ Start-Process "http://localhost:3000" })

$btnStop.Add_Click({
    if ($backendProcess) { $backendProcess.Kill() }
    if ($frontendProcess) { $frontendProcess.Kill() }
    [System.Windows.MessageBox]::Show("Alle Prozesse wurden beendet!", "Gestoppt", "OK", "Information")
    $mainWindow.Close()
  })

$btnRestart.Add_Click({
    [System.Windows.MessageBox]::Show("Restart-Funktion: Nicht implementiert", "Info", "OK", "Information")
  })

$btnClose.Add_Click({
    $result = [System.Windows.MessageBox]::Show("Prozesse laufen weiter im Hintergrund. Fenster schließen?", "Bestätigung", "YesNo", "Question")
    if ($result -eq "Yes") {
      $mainWindow.Close()
    }
  })

# === Fenster anzeigen ===
$mainWindow.ShowDialog() | Out-Null