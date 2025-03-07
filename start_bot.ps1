# Limpa a tela
Clear-Host

# Navega at� o diret�rio do bot (mesmo diret�rio do script)
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location -Path $scriptPath

# Define o caminho do log
$logPath = Join-Path $scriptPath "log.txt"
Start-Transcript -Path $logPath

# Compila o TypeScript
tsc

# Executa o bot
node dist/index.js

# Mant�m a janela aberta
Read-Host -Prompt "Pressione Enter para fechar a janela"

# Para a transcri��o do log
Stop-Transcript
