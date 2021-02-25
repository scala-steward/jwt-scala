## JwtSession case class

Provides an API similar to the Play [Session](https://www.playframework.com/documentation/2.3.x/api/scala/index.html#play.api.mvc.Session) but using `JsValue` rather than `String` as values. It also separates `headerData` from `claimData` rather than having only one `data`.

### Basic usage

```scala
scala> import java.time.Clock
import java.time.Clock

scala> import pdi.jwt.JwtSession
import pdi.jwt.JwtSession

scala> import play.api.Configuration
import play.api.Configuration

scala> implicit val clock: Clock = Clock.systemUTC
clock: java.time.Clock = SystemClock[Z]

scala> //In a real Play! App this should normally be injected in the constructor with @Inject()
     | implicit val conf:Configuration = Configuration.reference
conf: play.api.Configuration = Configuration(Config(SimpleConfigObject({"akka":{"actor":{"allow-java-serialization":"off","creation-timeout":"20s","debug":{"autoreceive":"off","event-stream":"off","fsm":"off","lifecycle":"off","receive":"off","router-misconfiguration":"off","unhandled":"off"},"default-blocking-io-dispatcher":{"executor":"thread-pool-executor","thread-pool-executor":{"fixed-pool-size":16},"throughput":1,"type":"Dispatcher"},"default-dispatcher":{"affinity-pool-executor":{"fair-work-distribution":{"threshold":128},"idle-cpu-level":5,"parallelism-factor":0.8,"parallelism-max":64,"parallelism-min":4,"queue-selector":"akka.dispatch.affinity.FairDistributionHashCache","rejection-handler":"akka.dispatch.affinity.ThrowOnOverflowRejectionHandler","task-...

scala> // Let's create a session, it will automatically assign a default header. No
     | // In your app, the default header would be generated from "application.conf" file
     | // but here, it will just use the default values (which are all empty)
     | var session = JwtSession()
session: pdi.jwt.JwtSession = JwtSession({"typ":"JWT","alg":"HS256"},{},)

scala> // We can add a (key, value)
     | session = session + ("user", 1)
session: pdi.jwt.JwtSession = JwtSession({"typ":"JWT","alg":"HS256"},{"user":1},)

scala> // Or several of them
     | session = session ++ (("nbf", 1431520421), ("key", "value"), ("key2", 2), ("key3", 3))
session: pdi.jwt.JwtSession = JwtSession({"typ":"JWT","alg":"HS256"},{"key2":2,"nbf":1431520421,"key3":3,"user":1,"key":"value"},)

scala> // Also remove a key
     | session = session - "key"
session: pdi.jwt.JwtSession = JwtSession({"typ":"JWT","alg":"HS256"},{"key2":2,"nbf":1431520421,"key3":3,"user":1},)

scala> // Or several
     | session = session -- ("key2", "key3")
session: pdi.jwt.JwtSession = JwtSession({"typ":"JWT","alg":"HS256"},{"nbf":1431520421,"user":1},)

scala> // We can access a specific key
     | session.get("user")
res9: Option[play.api.libs.json.JsValue] = Some(1)

scala> // Test if the session is empty or not
     | // (it is not here since we have several keys in the claimData)
     | session.isEmpty
res12: Boolean = false

scala> // Serializing the session is the same as encoding it as a JSON Web Token
     | val token = session.serialize
token: String = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYmYiOjE0MzE1MjA0MjEsInVzZXIiOjF9.0nOuCxfVTiJEOwB99ruZ0a5iP5HumhG5xu0ccKoonSM

scala> // You can create a JwtSession from a token of course
     | JwtSession.deserialize(token)
res15: pdi.jwt.JwtSession = JwtSession({"typ":"JWT","alg":"HS256"},{"nbf":1431520421,"user":1},0nOuCxfVTiJEOwB99ruZ0a5iP5HumhG5xu0ccKoonSM)

scala> // You could refresh the session to set its expiration in a few seconds from now
     | // but you need to set "session.maxAge" in your "application.conf" and since this
     | // is not a real Play application, we cannot do that, so here, the refresh will do nothing.
     | session = session.refresh
session: pdi.jwt.JwtSession = JwtSession({"typ":"JWT","alg":"HS256"},{"nbf":1431520421,"user":1},)
```

### Using implicits

If you have implicit `Reads` and/or `Writes`, you can access and/or add data directly as case class or object.

```scala
scala> // First, creating the implicits
     | import play.api.libs.json.Json
import play.api.libs.json.Json

scala> import play.api.libs.functional.syntax._
import play.api.libs.functional.syntax._

scala> import play.api.Configuration
import play.api.Configuration

scala> //In a real Play! App this should normally be injected in the constructor with @Inject()
     | implicit val conf:Configuration = Configuration.reference
conf: play.api.Configuration = Configuration(Config(SimpleConfigObject({"akka":{"actor":{"allow-java-serialization":"off","creation-timeout":"20s","debug":{"autoreceive":"off","event-stream":"off","fsm":"off","lifecycle":"off","receive":"off","router-misconfiguration":"off","unhandled":"off"},"default-blocking-io-dispatcher":{"executor":"thread-pool-executor","thread-pool-executor":{"fixed-pool-size":16},"throughput":1,"type":"Dispatcher"},"default-dispatcher":{"affinity-pool-executor":{"fair-work-distribution":{"threshold":128},"idle-cpu-level":5,"parallelism-factor":0.8,"parallelism-max":64,"parallelism-min":4,"queue-selector":"akka.dispatch.affinity.FairDistributionHashCache","rejection-handler":"akka.dispatch.affinity.ThrowOnOverflowRejectionHandler","task-...

scala> case class User(id: Long, name: String)
defined class User

scala> implicit val formatUser = Json.format[User]
formatUser: play.api.libs.json.OFormat[User] = play.api.libs.json.OFormat$$anon$3@f14a83f

scala> // Next, adding it to a new session
     | val session2 = JwtSession() + ("user", User(42, "Paul"))
session2: pdi.jwt.JwtSession = JwtSession({"typ":"JWT","alg":"HS256"},{"user":{"id":42,"name":"Paul"}},)

scala> // Finally, accessing it
     | session2.getAs[User]("user")
res23: Option[User] = Some(User(42,Paul))
```

## Play RequestHeader

You can extract a `JwtSession` from a `RequestHeader`.

```scala
scala> import pdi.jwt._
import pdi.jwt._

scala> import pdi.jwt.JwtSession._
import pdi.jwt.JwtSession._

scala> import play.api.test.{FakeRequest, FakeHeaders}
import play.api.test.{FakeRequest, FakeHeaders}

scala> import play.api.Configuration
import play.api.Configuration

scala> //In a real Play! App this should normally be injected in the constructor with @Inject()
     | implicit val conf:Configuration = Configuration.reference
conf: play.api.Configuration = Configuration(Config(SimpleConfigObject({"akka":{"actor":{"allow-java-serialization":"off","creation-timeout":"20s","debug":{"autoreceive":"off","event-stream":"off","fsm":"off","lifecycle":"off","receive":"off","router-misconfiguration":"off","unhandled":"off"},"default-blocking-io-dispatcher":{"executor":"thread-pool-executor","thread-pool-executor":{"fixed-pool-size":16},"throughput":1,"type":"Dispatcher"},"default-dispatcher":{"affinity-pool-executor":{"fair-work-distribution":{"threshold":128},"idle-cpu-level":5,"parallelism-factor":0.8,"parallelism-max":64,"parallelism-min":4,"queue-selector":"akka.dispatch.affinity.FairDistributionHashCache","rejection-handler":"akka.dispatch.affinity.ThrowOnOverflowRejectionHandler","task-...

scala> // Default JwtSession
     | FakeRequest().jwtSession
res26: pdi.jwt.JwtSession = JwtSession({"typ":"JWT","alg":"HS256"},{},)

scala> // What about some headers?
     | // (the default header for a JSON Web Token is "Authorization" and it should be prefixed by "Bearer ")
     | val request = FakeRequest().withHeaders(("Authorization", "Bearer " + session2.serialize))
request: play.api.test.FakeRequest[play.api.mvc.AnyContentAsEmpty.type] = GET /

scala> request.jwtSession
res29: pdi.jwt.JwtSession = JwtSession({"typ":"JWT","alg":"HS256"},{"user":{"id":42,"name":"Paul"}},P8vGvJMv8aTU8vxiP5b1U-IHjZpFpGid46UEMszKW2I)

scala> // It means you can directly read case classes from the session!
     | // And that's pretty cool
     | request.jwtSession.getAs[User]("user")
res32: Option[User] = Some(User(42,Paul))
```

## Play Result

There are also implicit helpers around `Result` to help you manipulate the session inside it.

```scala
scala> // Several functions will need an implicit RequestHeader
     | // since this is the only way to read the headers of the Result
     | import play.api.Configuration
import play.api.Configuration

scala> //In a real Play! App this should normally be injected in the constructor with @Inject()
     | implicit val conf:Configuration = Configuration.reference
conf: play.api.Configuration = Configuration(Config(SimpleConfigObject({"akka":{"actor":{"allow-java-serialization":"off","creation-timeout":"20s","debug":{"autoreceive":"off","event-stream":"off","fsm":"off","lifecycle":"off","receive":"off","router-misconfiguration":"off","unhandled":"off"},"default-blocking-io-dispatcher":{"executor":"thread-pool-executor","thread-pool-executor":{"fixed-pool-size":16},"throughput":1,"type":"Dispatcher"},"default-dispatcher":{"affinity-pool-executor":{"fair-work-distribution":{"threshold":128},"idle-cpu-level":5,"parallelism-factor":0.8,"parallelism-max":64,"parallelism-min":4,"queue-selector":"akka.dispatch.affinity.FairDistributionHashCache","rejection-handler":"akka.dispatch.affinity.ThrowOnOverflowRejectionHandler","task-...

scala> implicit val implRequest = request
implRequest: play.api.test.FakeRequest[play.api.mvc.AnyContentAsEmpty.type] = GET /

scala> // Let's begin by creating a Result
     | var result: play.api.mvc.Result = play.api.mvc.Results.Ok
result: play.api.mvc.Result = Result(200, Map())

scala> // We can already get a JwtSession from our implicit RequestHeader
     | result.jwtSession
res38: pdi.jwt.JwtSession = JwtSession({"typ":"JWT","alg":"HS256"},{"user":{"id":42,"name":"Paul"}},P8vGvJMv8aTU8vxiP5b1U-IHjZpFpGid46UEMszKW2I)

scala> // Setting a new empty JwtSession
     | result = result.withNewJwtSession
result: play.api.mvc.Result = Result(200, Map(Authorization -> Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e30.pXJUVs71mK5D5WyxqBOYu8VwAXTl7Qhe4z9j2Hnhqsc))

scala> // Or from an existing JwtSession
     | result = result.withJwtSession(session2)
result: play.api.mvc.Result = Result(200, Map(Authorization -> Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjo0MiwibmFtZSI6IlBhdWwifX0.P8vGvJMv8aTU8vxiP5b1U-IHjZpFpGid46UEMszKW2I))

scala> // Or from a JsObject
     | result = result.withJwtSession(Json.obj(("id", 1), ("key", "value")))
result: play.api.mvc.Result = Result(200, Map(Authorization -> Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwia2V5IjoidmFsdWUifQ.m53lWQ3050LjjgtnQdH1yfilLz3UKlKZigYM0D52yGo))

scala> // Or from (key, value)
     | result = result.withJwtSession(("id", 1), ("key", "value"))
result: play.api.mvc.Result = Result(200, Map(Authorization -> Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwia2V5IjoidmFsdWUifQ.m53lWQ3050LjjgtnQdH1yfilLz3UKlKZigYM0D52yGo))

scala> // We can add stuff to the current session (only (String, String))
     | result = result.addingToJwtSession(("key2", "value2"), ("key3", "value3"))
result: play.api.mvc.Result = Result(200, Map(Authorization -> Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJrZXkyIjoidmFsdWUyIiwia2V5MyI6InZhbHVlMyIsImlkIjoxLCJrZXkiOiJ2YWx1ZSJ9._Lm6eCCUuIH_3ZPDP9jljR5iOjHI6LXEn7I9gTuXubk))

scala> // Or directly classes or objects if you have the correct implicit Writes
     | result = result.addingToJwtSession("user", User(1, "Paul"))
result: play.api.mvc.Result = Result(200, Map(Authorization -> Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJrZXkyIjoidmFsdWUyIiwia2V5MyI6InZhbHVlMyIsImlkIjoxLCJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiUGF1bCJ9LCJrZXkiOiJ2YWx1ZSJ9.kB42tDpHBArdpurZ2hhXH1wbINsxOWRaaAjpQShbq8M))

scala> // Removing from session
     | result = result.removingFromJwtSession("key2", "key3")
result: play.api.mvc.Result = Result(200, Map(Authorization -> Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlciI6eyJpZCI6MSwibmFtZSI6IlBhdWwifSwia2V5IjoidmFsdWUifQ.z9IQk9hNgtfolWlIxvgZ45Hcp94N32hGAPhw8CW_29w))

scala> // Refresh the current session
     | result = result.refreshJwtSession
result: play.api.mvc.Result = Result(200, Map(Authorization -> Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlciI6eyJpZCI6MSwibmFtZSI6IlBhdWwifSwia2V5IjoidmFsdWUifQ.z9IQk9hNgtfolWlIxvgZ45Hcp94N32hGAPhw8CW_29w))

scala> // So, at the end, you can do
     | result.jwtSession.getAs[User]("user")
res48: Option[User] = Some(User(1,Paul))
```

## Play configuration

### Secret key

`play.http.secret.key`

> Default: none

The secret key is used to secure cryptographics functions. We are using the same key to sign Json Web Tokens so you don't need to worry about it.

### Private key

`play.http.session.privateKey`

> Default: none

The PKCS8 format private key is used to sign JWT session. If `play.http.session.privateKey` is missing `play.http.secret.key` used instead.


### Public key

`play.http.session.publicKey`

> Default: none

The X.509 format public key is used to verify JWT session signed with private key `play.http.session.privateKey`


### Session timeout

`play.http.session.maxAge`

> Default: none

Just like for the cookie session, you can use this key to specify the duration, in milliseconds or using the duration syntax (for example 30m or 1h), after which the user should be logout, which mean the token will no longer be valid. It means you need to refresh the expiration date at each request

### Signature algorithm

`play.http.session.algorithm`

> Default: HS256
>
> Supported: HMD5, HS1, HS224, HS256, HS384, HS512, RS256, RS384, RS512, ES256, ES384, ES512

You can specify which algorithm you want to use, among the supported ones, in order to create the signature which will assure you that nobody can actually change the token. You should probably stick with the default one or use HmacSHA512 for maximum security.

### Header name

`play.http.session.jwtName`

> Default: Authorization

You can change the name of the header in which the token should be stored. It will be used for both requests and responses.

### Response header name

`play.http.session.jwtResponseName`

> Default: none

If you need to have a different header for request and response, you can override the response header using this key.


### Token prefix

`play.http.session.tokenPrefix`

> Default: "Bearer "

Authorization header should have a prefix before the token, like "Basic" for example. For a JWT token, it should be "Bearer" (which is the default value) but you can freely change or remove it (using an empty string). The token prefix will be directly prepend before the token, so be sure to put any necessary whitespaces in it.
