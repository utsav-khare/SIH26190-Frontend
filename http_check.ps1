$url = 'http://localhost:3000'
$status = 'FAIL'
$title = ''
try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing
    $status = $r.StatusCode
    if ($r.Content -imatch '<title>(.*?)</title>') { $title = $Matches[1] }
} catch {
    $title = $_.Exception.Message
}
Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' -ArgumentList $url -WindowStyle Normal -ErrorAction SilentlyContinue
$out = "CHECK_URL: $url`nSTATUS: $status`nTITLE: $title"
Write-Host $out
Set-Content -LiteralPath 'C:\Users\UTSAV KHARE\Documents\SIH26190\launch_check_out.txt' -Value $out
