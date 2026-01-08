Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase

# === XAML-String ===
$xamlString = @"
<Window xmlns='http://schemas.microsoft.com/winfx/2006/xaml/presentation'
        Title='D&amp;D Session Manager'
        WindowStartupLocation='CenterScreen'
        Width='500' Height='300'
        ResizeMode='NoResize'
        WindowStyle='None'
        Background='#111'>
    <Grid>
        <TextBlock Text='🪄 D&amp;D Session Manager'
                   FontSize='28'
                   Foreground='#FFAA00'
                   FontWeight='Bold'
                   HorizontalAlignment='Center'
                   Margin='0,30,0,0'/>
        <TextBlock x:Name='statusText'
                   Text='Bereite magische Energien vor...'
                   Foreground='White'
                   FontSize='16'
                   HorizontalAlignment='Center'
                   Margin='0,90,0,0'/>
        <ProgressBar x:Name='progressBar'
                     Width='400' Height='25'
                     HorizontalAlignment='Center'
                     VerticalAlignment='Bottom'
                     Margin='0,0,0,50'
                     Foreground='#FFAA00'
                     Background='#333'
                     BorderBrush='#222'/>
        <TextBlock x:Name='percentage'
                   Text='0%'
                   Foreground='#FFAA00'
                   FontWeight='Bold'
                   HorizontalAlignment='Center'
                   VerticalAlignment='Bottom'
                   Margin='0,0,0,20'/>
    </Grid>
</Window>
"@

# === XAML laden ===
$reader = New-Object System.Xml.XmlNodeReader ([xml]$xamlString)
$window = [Windows.Markup.XamlReader]::Load($reader)

if (-not $window) { 
    Write-Error "XAML konnte nicht geladen werden!" 
    exit
}

# === Elemente finden ===
$progressBar = $window.FindName("progressBar")
$statusText = $window.FindName("statusText")
$percentage = $window.FindName("percentage")

# === Magische Phrasen ===
$phrases = @(
    "Beschwöre Backend-Dämonen...",
    "Öffne Portale zu localhost...",
    "Rufe Helden aus der Datenbank...",
    "Stimme Musik der Tavernen ab...",
    "Bereite Vite-Runen vor...",
    "Rufe Ngrok-Geist herbei...",
    "Setze Session-Zauber...",
    "Bereit, Meister Kevin!"
)

# === Animation ===
$window.Show()
for ($i = 0; $i -le 100; $i++) {
    $progressBar.Value = $i
    $percentage.Text = "$i%"
    if ($i -lt $phrases.Count) {
        $statusText.Text = $phrases[$i]
    }
    Start-Sleep -Milliseconds 80
}
Start-Sleep -Milliseconds 600
$window.Close()
exit
