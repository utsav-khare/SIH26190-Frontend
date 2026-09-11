Remove-Item -LiteralPath 'C:\Users\UTSAV KHARE\Documents\SIH26190\server_check.ps1' -Force -ErrorAction SilentlyContinue

$l = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($null -ne $l) {
    "LISTENING PID: $($l.OwningProcess)"
} else {
    "NOT_LISTENING"
}
