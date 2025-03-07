# Limpa a tela
Clear-Host

# Navega até o diretório do bot (mesmo diretório do script)
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location -Path $scriptPath

# Define o caminho do log
$logPath = Join-Path $scriptPath "log.txt"
Start-Transcript -Path $logPath

# Compila o TypeScript
tsc

# Executa o bot
node dist/index.js

# Mantém a janela aberta
Read-Host -Prompt "Pressione Enter para fechar a janela"

# Para a transcrição do log
Stop-Transcript
