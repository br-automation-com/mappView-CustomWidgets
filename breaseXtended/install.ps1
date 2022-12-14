# -------------------------------------------------------------------------------------------------------------------------------
# Powershell script to copy custom widget library into Automation Studio mappView path
# Parameters:
# - Project path
# - Library name
# - Automation Studio installation path
#
# Example
# Add the following line to your Automation Studio project at Properties->Build Events->Configuration Pre-Build Step
# powershell.exe $(AS_PROJECT_PATH)\Logical\mappView\breaseXtended\install.ps1 $(AS_PROJECT_PATH) breaseXtended $(WIN32_AS_PATH)
# -------------------------------------------------------------------------------------------------------------------------------

$pathProject=$args[0]
$nameLibrary=$args[1]
$pathAS=$args[2]

if (Test-Path ($PSScriptRoot  + "\log.txt")) {
    Remove-Item ($PSScriptRoot  + "\log.txt")
}
Write-Output ("Start script: " + $(Get-Date)) ("Script path: " + $PSScriptRoot) "----------------------------------" >> ($PSScriptRoot + "\log.txt")
Write-Output "Parameters received" $args "----------------------------------" >> ($PSScriptRoot + "\log.txt")

# --------------------------------------------------------------------
# Get project file
$apjPath = $pathProject
Get-ChildItem -Path $pathProject -Filter *.apj -File -Name| ForEach-Object {
    $apjPath += "\" + $_
}

# Make sure apj was found
if ($apjPath -ne $pathProject) {
        Write-Output ("Project path: " + $apjPath) >> ($PSScriptRoot + "\log.txt")

        # --------------------------------------------------------------------
        # Read mapp version
        [XML]$empDetails = Get-Content $apjPath

        $pathMapp = $pathAS + "\"
        foreach($empDetail in $empDetails.Project.TechnologyPackages.mappView){
            Write-Output ("mapp Version: " +$empDetail.Version) >> ($PSScriptRoot + "\log.txt")
            $pathMapp += "AS\TechnologyPackages\mappView\" + $empDetail.Version + "\Widgets\" + $nameLibrary + "\"
            Write-Output ("AS mapp path: " + $pathMapp) >> ($PSScriptRoot + "\log.txt")
        }

        # --------------------------------------------------------------------
        # Copy library to AS folder
        if (Test-Path ($pathMapp)) {
            Write-Output ("Removed old library") >> ($PSScriptRoot + "\log.txt")
            Remove-Item ($pathMapp) -Recurse -Force
        }
        Copy-Item -Path  $PSScriptRoot -Destination $pathMapp -Recurse -force
    }
    else{
        Write-Output ("Error apjPath not found!" + $apjPath) >> ($PSScriptRoot + "\log.txt")
    }
