// Run with kotlinc -scripts download.kts

import java.io.File
import java.net.URL
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.StandardCopyOption

val dir = "/Users/cedricbeust/javascript/CedCube/WebContent/"
val file = dir + "f2l.html"

    File(file).readLines().filter { it.contains("http://cube.crider.co.uk") }.forEachIndexed { index: Int, line: String ->
        val pairs = line.split(" ").filter { it.contains("=")}.map {
            it.split("=").let { split ->
                val other =
                    if (it.startsWith("src=")) it.substring(it.indexOf('"') + 1, it.lastIndexOf('"') - 1)
                    else split[1].removeSurrounding("\"")
                Pair(split[0], other)
            }
        }
        val map = hashMapOf(*pairs.toTypedArray())
        if (! map.containsKey("id")) {
            println("Skipping $line")
        } else {
            URL(map["src"]).openStream().use { inputStream ->
                val fileName = Paths.get(dir, "pics", map["id"] + ".svg")
                Files.copy(inputStream, fileName, StandardCopyOption.REPLACE_EXISTING)
                println("Created $fileName")
            }
        }
    }
