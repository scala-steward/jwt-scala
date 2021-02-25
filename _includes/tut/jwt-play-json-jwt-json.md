## JwtJson Object

### Basic usage

```scala
scala> import java.time.Clock
import java.time.Clock

scala> import pdi.jwt.{JwtJson, JwtAlgorithm}
import pdi.jwt.{JwtJson, JwtAlgorithm}

scala> import play.api.libs.json.Json
import play.api.libs.json.Json

scala> implicit val clock: Clock = Clock.systemUTC
clock: java.time.Clock = SystemClock[Z]

scala> val claim = Json.obj(("user", 1), ("nbf", 1431520421))
claim: play.api.libs.json.JsObject = {"user":1,"nbf":1431520421}

scala> val key = "secretKey"
key: String = secretKey

scala> val algo = JwtAlgorithm.HS256
algo: pdi.jwt.JwtAlgorithm.HS256.type = HS256

scala> JwtJson.encode(claim)
res0: String = eyJhbGciOiJub25lIn0.eyJ1c2VyIjoxLCJuYmYiOjE0MzE1MjA0MjF9.

scala> val token = JwtJson.encode(claim, key, algo)
token: String = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxLCJuYmYiOjE0MzE1MjA0MjF9.VmfmoqRbRvna9lfpCx4lXf96eD_X_woBM0twLjBGLlQ

scala> JwtJson.decodeJson(token, key, Seq(JwtAlgorithm.HS256))
res1: scala.util.Try[play.api.libs.json.JsObject] = Success({"user":1,"nbf":1431520421})

scala> JwtJson.decode(token, key, Seq(JwtAlgorithm.HS256))
res2: scala.util.Try[pdi.jwt.JwtClaim] = Success(pdi.jwt.JwtClaim@1d288770)
```

### Encoding

```scala
scala> val header = Json.obj(("typ", "JWT"), ("alg", "HS256"))
header: play.api.libs.json.JsObject = {"typ":"JWT","alg":"HS256"}

scala> // From just the claim to all possible attributes
     | JwtJson.encode(claim)
res4: String = eyJhbGciOiJub25lIn0.eyJ1c2VyIjoxLCJuYmYiOjE0MzE1MjA0MjF9.

scala> JwtJson.encode(claim, key, algo)
res5: String = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxLCJuYmYiOjE0MzE1MjA0MjF9.VmfmoqRbRvna9lfpCx4lXf96eD_X_woBM0twLjBGLlQ

scala> JwtJson.encode(header, claim, key)
res6: String = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxLCJuYmYiOjE0MzE1MjA0MjF9.VmfmoqRbRvna9lfpCx4lXf96eD_X_woBM0twLjBGLlQ
```

### Decoding

```scala
scala> // You can decode to JsObject
     | JwtJson.decodeJson(token, key, Seq(JwtAlgorithm.HS256))
res8: scala.util.Try[play.api.libs.json.JsObject] = Success({"user":1,"nbf":1431520421})

scala> JwtJson.decodeJsonAll(token, key, Seq(JwtAlgorithm.HS256))
res9: scala.util.Try[(play.api.libs.json.JsObject, play.api.libs.json.JsObject, String)] = Success(({"typ":"JWT","alg":"HS256"},{"user":1,"nbf":1431520421},VmfmoqRbRvna9lfpCx4lXf96eD_X_woBM0twLjBGLlQ))

scala> // Or to case classes
     | JwtJson.decode(token, key, Seq(JwtAlgorithm.HS256))
res11: scala.util.Try[pdi.jwt.JwtClaim] = Success(pdi.jwt.JwtClaim@1d288770)

scala> JwtJson.decodeAll(token, key, Seq(JwtAlgorithm.HS256))
res12: scala.util.Try[(pdi.jwt.JwtHeader, pdi.jwt.JwtClaim, String)] = Success((pdi.jwt.JwtHeader@ac020068,pdi.jwt.JwtClaim@1d288770,VmfmoqRbRvna9lfpCx4lXf96eD_X_woBM0twLjBGLlQ))
```

### Formating

The project provides implicit reader and writer for both `JwtHeader` and `JwtClaim`

```scala
scala> import pdi.jwt._
import pdi.jwt._

scala> import pdi.jwt.JwtJson._
import pdi.jwt.JwtJson._

scala> // Reads
     | Json.fromJson[JwtHeader](header)
res14: play.api.libs.json.JsResult[pdi.jwt.JwtHeader] = JsSuccess(pdi.jwt.JwtHeader@ac020068,)

scala> Json.fromJson[JwtClaim](claim)
res15: play.api.libs.json.JsResult[pdi.jwt.JwtClaim] = JsSuccess(pdi.jwt.JwtClaim@1d288770,)

scala> // Writes
     | Json.toJson(JwtHeader(JwtAlgorithm.HS256))
res17: play.api.libs.json.JsValue = {"typ":"JWT","alg":"HS256"}

scala> Json.toJson(JwtClaim("""{"user":1}""").issuedNow.expiresIn(10))
res18: play.api.libs.json.JsValue = {"exp":1614271262,"iat":1614271252,"user":1}

scala> // Or
     | JwtHeader(JwtAlgorithm.HS256).toJsValue
res20: play.api.libs.json.JsValue = {"typ":"JWT","alg":"HS256"}

scala> JwtClaim("""{"user":1}""").issuedNow.expiresIn(10).toJsValue
res21: play.api.libs.json.JsValue = {"exp":1614271262,"iat":1614271252,"user":1}
```
