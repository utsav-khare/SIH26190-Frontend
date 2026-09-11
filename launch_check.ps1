$addr = 'localhost'
$port = 3000
$url = 'http://' + $addr + ':' + $port
$ok = $false
try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing
    $status = $r.StatusCode
    $title = ''
    if ($r.Content -imatch '<title>(.*?)</title>') { $title = $Matches[1] }
    $ok = $true
} catch {
    $status = 'FAIL'
    $title = $_.Exception.Message
}
$out = 'CHECK_URL:' + $url + '`nSTATUS:' + $status + '`nTITLE:' + $title
Write-Host $out
$out | Out-File -LiteralPath 'C:\Users\UTSAV KHARE\Documents\SIH26190\launch_check_out.txt' -Encoding utf8 -Force
