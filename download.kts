// Run with kotlinc -scripts download.kts

import java.io.File
import java.net.URL
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.StandardCopyOption

val dir = System.getProperty("user.home") + File.separatorChar + "/javascript/CedCube/"
val file = dir + "js/f2l.js"
val host = "http://cube.crider.co.uk/visualcube.php?fmt=svg&size=140&r=y30x-30&cc=n&co=15&fo=35&bg=888888&fo=100&fc="
var id = ""
var colors = ""

fun extract(line: String) : String {
    val s = line.split(":")
    return s[1].replace("\"", "").replace(",", "").trim()
}

File(file).readLines().forEach { line ->
    if (line.contains("id:")) {
        id = extract(line)
    } else if (line.contains("colors:")) {
        colors = extract(line)

        val url = host + colors
        val fileName = Paths.get(dir, "pics", id + ".svg")
        println("Downloading to $fileName: $url")
        URL(url).openStream().use { inputStream ->
            Files.copy(inputStream, fileName, StandardCopyOption.REPLACE_EXISTING)
            println("Created $fileName")
        }
    }
}
