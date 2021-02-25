## JwtHeader Case Class

```scala
scala> import pdi.jwt.{JwtHeader, JwtAlgorithm}
import pdi.jwt.{JwtHeader, JwtAlgorithm}

scala> JwtHeader()
res0: pdi.jwt.JwtHeader = pdi.jwt.JwtHeader@71da1600

scala> JwtHeader(JwtAlgorithm.HS256)
res1: pdi.jwt.JwtHeader = pdi.jwt.JwtHeader@ac020068

scala> JwtHeader(JwtAlgorithm.HS256, "JWT")
res2: pdi.jwt.JwtHeader = pdi.jwt.JwtHeader@ac020068

scala> // You can stringify it to JSON
     | JwtHeader(JwtAlgorithm.HS256, "JWT").toJson
res4: String = {"typ":"JWT","alg":"HS256"}

scala> // You can assign the default type (but it would have be done automatically anyway)
     | JwtHeader(JwtAlgorithm.HS256).withType
res6: pdi.jwt.JwtHeader = pdi.jwt.JwtHeader@ac020068
```
