## Jwt object

### Basic usage

```scala
scala> import java.time.Clock
import java.time.Clock

scala> import pdi.jwt.{Jwt, JwtAlgorithm, JwtHeader, JwtClaim, JwtOptions}
import pdi.jwt.{Jwt, JwtAlgorithm, JwtHeader, JwtClaim, JwtOptions}

scala> implicit val clock: Clock = Clock.systemUTC
clock: java.time.Clock = SystemClock[Z]

scala> val token = Jwt.encode("""{"user":1}""", "secretKey", JwtAlgorithm.HS256)
token: String = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxfQ.oG3iKnAvj_OKCv0tchT90sv2IFVeaREgvJmwgRcXfkI

scala> Jwt.decodeRawAll(token, "secretKey", Seq(JwtAlgorithm.HS256))
res0: scala.util.Try[(String, String, String)] = Success(({"typ":"JWT","alg":"HS256"},{"user":1},oG3iKnAvj_OKCv0tchT90sv2IFVeaREgvJmwgRcXfkI))

scala> Jwt.decodeRawAll(token, "wrongKey", Seq(JwtAlgorithm.HS256))
res1: scala.util.Try[(String, String, String)] = Failure(pdi.jwt.exceptions.JwtValidationException: Invalid signature for this token or wrong algorithm.)
```

### Encoding

```scala
scala> // Encode from string, header automatically generated
     | Jwt.encode("""{"user":1}""", "secretKey", JwtAlgorithm.HS384)
res3: String = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJ1c2VyIjoxfQ.Do0PQWccbp1J7ZWcFL-_IY9OFaI-7t75k7-NxZ52jk2kAb0sFopJEeZapkiXthEp

scala> // Encode from case class, header automatically generated
     | // Set that the token has been issued now and expires in 10 seconds
     | Jwt.encode(JwtClaim({"""{"user":1}"""}).issuedNow.expiresIn(10), "secretKey", JwtAlgorithm.HS512)
res6: String = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2MTQyNzEyNTUsImlhdCI6MTYxNDI3MTI0NSwidXNlciI6MX0.BdnXADBDD2kTNKXqa31atKXhy8PWb-AAvTafKsBcqE2IiONY1r1VgF-6JdaofwfhjEAbAcx7NETmxGNkI3ao8g

scala> // You can encode without signing it
     | Jwt.encode("""{"user":1}""")
res8: String = eyJhbGciOiJub25lIn0.eyJ1c2VyIjoxfQ.

scala> // You can specify a string header but also need to specify the algorithm just to be sure
     | // This is not really typesafe, so please use it with care
     | Jwt.encode("""{"typ":"JWT","alg":"HS256"}""", """{"user":1}""", "key", JwtAlgorithm.HS256)
res11: String = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxfQ.kaxGIncoYdxOD5RxfwwiP7mRxqUnRqDemW_f9R1k98U

scala> // If using a case class header, no need to repeat the algorithm
     | // This is way better than the previous one
     | Jwt.encode(JwtHeader(JwtAlgorithm.HS256), JwtClaim("""{"user":1}"""), "key")
res14: String = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxfQ.kaxGIncoYdxOD5RxfwwiP7mRxqUnRqDemW_f9R1k98U
```

### Decoding

In JWT Scala, espcially when using raw strings which are not typesafe at all, there are a lot of possible errors. This is why nearly all `decode` functions will return a `Try` rather than directly the expected result. In case of failure, the wrapped exception should tell you what went wrong.

Take note that nearly all decoding methods (including those from helper libs) support either a String key, or a PrivateKey with a Hmac algorithm or a PublicKey with a RSA or ECDSA algorithm.

```scala
scala> // Decode all parts of the token as string
     | Jwt.decodeRawAll(token, "secretKey", JwtAlgorithm.allHmac)
res16: scala.util.Try[(String, String, String)] = Success(({"typ":"JWT","alg":"HS256"},{"user":1},oG3iKnAvj_OKCv0tchT90sv2IFVeaREgvJmwgRcXfkI))

scala> // Decode only the claim as a string
     | Jwt.decodeRaw(token, "secretKey", Seq(JwtAlgorithm.HS256))
res18: scala.util.Try[String] = Success({"user":1})

scala> // Decode all parts and cast them as a better type if possible.
     | // Since the implementation in JWT Core only use string, it is the same as decodeRawAll
     | // But check the result in JWT Play JSON to see the difference
     | Jwt.decodeAll(token, "secretKey", Seq(JwtAlgorithm.HS256))
res22: scala.util.Try[(pdi.jwt.JwtHeader, pdi.jwt.JwtClaim, String)] = Success((pdi.jwt.JwtHeader@ac020068,pdi.jwt.JwtClaim@a0b74282,oG3iKnAvj_OKCv0tchT90sv2IFVeaREgvJmwgRcXfkI))

scala> // Same as before, but only the claim
     | // (you should start to see a pattern in the naming convention of the functions)
     | Jwt.decode(token, "secretKey", Seq(JwtAlgorithm.HS256))
res25: scala.util.Try[pdi.jwt.JwtClaim] = Success(pdi.jwt.JwtClaim@a0b74282)

scala> // Failure because the token is not a token at all
     | Jwt.decode("Hey there!")
res27: scala.util.Try[pdi.jwt.JwtClaim] = Failure(pdi.jwt.exceptions.JwtLengthException: Expected token [Hey there!] to be composed of 2 or 3 parts separated by dots.)

scala> // Failure if not Base64 encoded
     | Jwt.decode("a.b.c")
res29: scala.util.Try[pdi.jwt.JwtClaim] = Failure(java.lang.IllegalArgumentException: Input byte[] should at least have 2 bytes for base64 bytes)

scala> // Failure in case we use the wrong key
     | Jwt.decode(token, "wrongKey", Seq(JwtAlgorithm.HS256))
res31: scala.util.Try[pdi.jwt.JwtClaim] = Failure(pdi.jwt.exceptions.JwtValidationException: Invalid signature for this token or wrong algorithm.)

scala> // Failure if the token only starts in 5 seconds
     | Jwt.decode(Jwt.encode(JwtClaim().startsIn(5)))
res33: scala.util.Try[pdi.jwt.JwtClaim] = Failure(pdi.jwt.exceptions.JwtNotBeforeException: The token will only be valid after 2021-02-25T16:40:50Z)
```

### Validating

If you only want to check if a token is valid without decoding it. You have two options: `validate` functions that will throw the exceptions we saw in the decoding section, so you know what went wrong, or `isValid` functions that will return a boolean in case you don't care about the actual error and don't want to bother with catching exception.

```scala
scala> // All good
     | Jwt.validate(token, "secretKey", Seq(JwtAlgorithm.HS256))

scala> Jwt.isValid(token, "secretKey", Seq(JwtAlgorithm.HS256))
res36: Boolean = true

scala> // Wrong key here
     | Jwt.validate(token, "wrongKey", Seq(JwtAlgorithm.HS256))
pdi.jwt.exceptions.JwtValidationException: Invalid signature for this token or wrong algorithm.
  at pdi.jwt.JwtCore.validate(Jwt.scala:611)
  at pdi.jwt.JwtCore.validate$(Jwt.scala:594)
  at pdi.jwt.Jwt$.validate(JwtPureScala.scala:19)
  at pdi.jwt.JwtCore.validate(Jwt.scala:619)
  at pdi.jwt.JwtCore.validate$(Jwt.scala:618)
  at pdi.jwt.Jwt$.validate(JwtPureScala.scala:19)
  at pdi.jwt.JwtCore.validate(Jwt.scala:678)
  at pdi.jwt.JwtCore.validate$(Jwt.scala:676)
  at pdi.jwt.Jwt$.validate(JwtPureScala.scala:19)
  at pdi.jwt.JwtCore.validate(Jwt.scala:681)
  at pdi.jwt.JwtCore.validate$(Jwt.scala:681)
  at pdi.jwt.Jwt$.validate(JwtPureScala.scala:19)
  ... 42 elided

scala> Jwt.isValid(token, "wrongKey", Seq(JwtAlgorithm.HS256))
res39: Boolean = false

scala> // No key for unsigned token => ok
     | Jwt.validate(Jwt.encode("{}"))

scala> Jwt.isValid(Jwt.encode("{}"))
res42: Boolean = true

scala> // No key while the token is actually signed => wrong
     | Jwt.validate(token)
pdi.jwt.exceptions.JwtNonEmptySignatureException: Non-empty signature found inside the token while trying to verify without a key.
  at pdi.jwt.JwtCore.validate(Jwt.scala:581)
  at pdi.jwt.JwtCore.validate$(Jwt.scala:578)
  at pdi.jwt.Jwt$.validate(JwtPureScala.scala:19)
  at pdi.jwt.JwtCore.validate(Jwt.scala:660)
  at pdi.jwt.JwtCore.validate$(Jwt.scala:658)
  at pdi.jwt.Jwt$.validate(JwtPureScala.scala:19)
  at pdi.jwt.JwtCore.validate(Jwt.scala:663)
  at pdi.jwt.JwtCore.validate$(Jwt.scala:663)
  at pdi.jwt.Jwt$.validate(JwtPureScala.scala:19)
  ... 42 elided

scala> Jwt.isValid(token)
res45: Boolean = false

scala> // The token hasn't started yet!
     | Jwt.validate(Jwt.encode(JwtClaim().startsIn(5)))
pdi.jwt.exceptions.JwtNotBeforeException: The token will only be valid after 2021-02-25T16:40:51Z
  at pdi.jwt.JwtTime$.validateNowIsBetween(JwtTime.scala:57)
  at pdi.jwt.JwtTime$.validateNowIsBetweenSeconds(JwtTime.scala:73)
  at pdi.jwt.JwtCore.validateTiming(Jwt.scala:561)
  at pdi.jwt.JwtCore.validateTiming$(Jwt.scala:554)
  at pdi.jwt.Jwt$.validateTiming(JwtPureScala.scala:19)
  at pdi.jwt.JwtCore.validate(Jwt.scala:590)
  at pdi.jwt.JwtCore.validate$(Jwt.scala:578)
  at pdi.jwt.Jwt$.validate(JwtPureScala.scala:19)
  at pdi.jwt.JwtCore.validate(Jwt.scala:660)
  at pdi.jwt.JwtCore.validate$(Jwt.scala:658)
  at pdi.jwt.Jwt$.validate(JwtPureScala.scala:19)
  at pdi.jwt.JwtCore.validate(Jwt.scala:663)
  at pdi.jwt.JwtCore.validate$(Jwt.scala:663)
  at pdi.jwt.Jwt$.validate(JwtPureScala.scala:19)
  ... 42 elided

scala> Jwt.isValid(Jwt.encode(JwtClaim().startsIn(5)))
res48: Boolean = false

scala> // This is no token
     | Jwt.validate("a.b.c")
java.lang.IllegalArgumentException: Input byte[] should at least have 2 bytes for base64 bytes
  at java.base/java.util.Base64$Decoder.outLength(Base64.java:671)
  at java.base/java.util.Base64$Decoder.decode(Base64.java:537)
  at pdi.jwt.JwtBase64$.decode(JwtBase64.scala:9)
  at pdi.jwt.JwtBase64$.decodeString(JwtBase64.scala:17)
  at pdi.jwt.JwtBase64$.decodeString(JwtBase64.scala:20)
  at pdi.jwt.JwtCore.splitToken(Jwt.scala:193)
  at pdi.jwt.JwtCore.validate(Jwt.scala:659)
  at pdi.jwt.JwtCore.validate$(Jwt.scala:658)
  at pdi.jwt.Jwt$.validate(JwtPureScala.scala:19)
  at pdi.jwt.JwtCore.validate(Jwt.scala:663)
  at pdi.jwt.JwtCore.validate$(Jwt.scala:663)
  at pdi.jwt.Jwt$.validate(JwtPureScala.scala:19)
  ... 42 elided

scala> Jwt.isValid("a.b.c")
res51: Boolean = false
```

### Options

All validating and decoding methods support a final optional argument as a `JwtOptions` which allow you to disable validation checks. This is useful if you need to access data from an expired token for example. You can disable `expiration`, `notBefore` and `signature` checks. Be warned that if you disable the last one, you have no guarantee that the user didn't change the content of the token.

```scala
scala> val expiredToken = Jwt.encode(JwtClaim().by("me").expiresIn(-1));
expiredToken: String = eyJhbGciOiJub25lIn0.eyJpc3MiOiJtZSIsImV4cCI6MTYxNDI3MTI0Nn0.

scala> // Fail since the token is expired
     | Jwt.isValid(expiredToken)
res53: Boolean = false

scala> Jwt.decode(expiredToken)
res54: scala.util.Try[pdi.jwt.JwtClaim] = Failure(pdi.jwt.exceptions.JwtExpirationException: The token is expired since 2021-02-25T16:40:46Z)

scala> // Let's disable expiration check
     | Jwt.isValid(expiredToken, JwtOptions(expiration = false))
res56: Boolean = true

scala> Jwt.decode(expiredToken, JwtOptions(expiration = false))
res57: scala.util.Try[pdi.jwt.JwtClaim] = Success(pdi.jwt.JwtClaim@d675089f)
```

You can also specify a leeway, in seconds, to account for clock skew.

```scala
scala> // Allow 30sec leeway
     | Jwt.isValid(expiredToken, JwtOptions(leeway = 30))
res59: Boolean = true

scala> Jwt.decode(expiredToken, JwtOptions(leeway = 30))
res60: scala.util.Try[pdi.jwt.JwtClaim] = Success(pdi.jwt.JwtClaim@d675089f)
```
