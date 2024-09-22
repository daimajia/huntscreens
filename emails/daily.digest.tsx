import { Product } from "@/db/schema";
import { ProductHuntMetadata } from "@/db/schema/types";
import { Body, Column, Container, Hr, Html, Img, Link, Row, Section, Tailwind, Text } from "@react-email/components";

type DigestProps = {
  producthunts: Product[],
  yc_count: number,
  contactId: string
}

export default function DailyDigestEmail(props: DigestProps) {
  return (
    <Html style={{ fontFamily: "sans-serif" }}>
      <Tailwind>
        <Body>
          <Container className="mb-10">
            {props.yc_count > 0 && (
              <>
                <Text className="text-xl">🚀 YC invested {props.yc_count} companies today</Text>
                <Link className="text-xl" href="https://huntscreens.com/startup/yc">Check out the latest YC companies on HuntScreens</Link>
              </>
            )}
          </Container>
          {props.producthunts.map((ph) => {
            return <Container key={ph.uuid}>
              <Section>
                <Row className="border border-black items-center justify-center">
                  <Link href={`https://huntscreens.com/p/${ph.id}`}>
                    <Img style={{ border: "1px solid #dfdfdf", objectFit: "cover", objectPosition: "top" }} className=" border rounded-lg  object-cover object-top" width="500" height="300" 
                    src={`https://shot.huntscreens.com/cdn-cgi/image/width=990,height=500,fit=crop,gravity=0x0,format=webp/${ph.uuid}.webp`}>
                    </Img>
                  </Link>
                </Row>
                <Row className="mt-5">
                  <Column>
                    <Img className=" rounded-lg" width={50} height={50} src={ph.thumb_url || ""}></Img>
                  </Column>

                  <Column>
                    <Row className="flex flex-row items-center justify-between">
                      <Column>
                        <Link className="m-0 text-lg font-bold text-black hover:underline" href={ph.website || ""}>
                          {ph.name}
                        </Link>
                      </Column>
                      <Column>
                        <Text className="m-0 text-sm text-gray-500">(🔥 {(ph.metadata as ProductHuntMetadata).votesCount || 0} votes)</Text>
                      </Column>
                    </Row>
                    <Row><Text className="m-0">{ph.tagline}</Text></Row>
                  </Column>
                </Row>
              </Section>
              <Hr className="my-10" />
            </Container>
          })}

          <Container className="">
            <Link style={{ border: "1px solid #dfdfdf" }} className="bg-[#efefef]  text-black rounded-lg px-4 py-3  text-sm" href="https://huntscreens.com">
              More on HuntScreens.com ❤️
            </Link>
          </Container>

          <Hr className="my-20"></Hr>

          <Container>
            <Text className="text-sm text-gray-500">
              You are receiving this email because you opted-in to receive updates from HuntScreens.com
            </Text>
            <Link className="text-sm text-gray-500" href={`https://huntscreens.com/email/unsubscribe/${props.contactId}`}>Unsubscribe</Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}


// DailyDigestEmail.PreviewProps = {
//   contactId: "11",
//   yc_count: 10,
//   producthunts: [
//     {
//       "id": 468047,
//       "url": "https://www.producthunt.com/posts/writebook?utm_campaign=producthunt-api&utm_medium=api-v2&utm_source=Application%3A+HuntScreens+%28ID%3A+109673%29",
//       "name": "Writebook",
//       "tagline": "Instantly publish your own books on the web for free",
//       "description": "Blogging and posting on social is easy. But why is it so hard to publish a whole book on the web? It’s not anymore. Writebook is remarkably simple software that allows you to publish text and pictures in a simple, browsable online book format.",
//       "slug": "writebook",
//       "votesCount": 131,
//       "website": "https://once.com/writebook",
//       "productLinks": [
//         {
//           "type": "Website",
//           "url": "https://www.producthunt.com/r/JE2UD7ZQ43LPYV?utm_campaign=producthunt-api&utm_medium=api-v2&utm_source=Application%3A+HuntScreens+%28ID%3A+109673%29"
//         }
//       ],
//       "thumbnail": {
//         "type": "image",
//         "url": "https://ph-files.imgix.net/3da5acb3-3fb3-4cca-ac86-0409e6d87530.png?auto=format"
//       },
//       "cursor": null,
//       "topics": {
//         "nodes": [
//           {
//             "name": "Writing"
//           },
//           {
//             "name": "Books"
//           }
//         ]
//       },
//       "createdAt": "2024-07-03 14:42:48",
//       "featuredAt": "2024-07-03 14:42:48",
//       "uuid": "984d1a42-064e-49e3-92a4-3512f27d1114",
//       "s3": false,
//       "webp": true,
//       "added_at": "2024-07-03T15:20:14.004Z",
//       "commentCount": 10
//     },
//     {
//       "id": 468005,
//       "url": "https://www.producthunt.com/posts/birdesk?utm_campaign=producthunt-api&utm_medium=api-v2&utm_source=Application%3A+HuntScreens+%28ID%3A+109673%29",
//       "name": "Birdesk",
//       "tagline": "Create & schedule your tweets & threads like a pro",
//       "description": "Unleash Your Twitter Creativity - Create & Schedule Your Tweets & Threads Like a Pro!",
//       "slug": "birdesk",
//       "votesCount": 36,
//       "website": "https://birdesk.app/",
//       "productLinks": [
//         {
//           "type": "Website",
//           "url": "https://www.producthunt.com/r/23BQZB7TMVVYCN?utm_campaign=producthunt-api&utm_medium=api-v2&utm_source=Application%3A+HuntScreens+%28ID%3A+109673%29"
//         }
//       ],
//       "thumbnail": {
//         "type": "image",
//         "url": "https://ph-files.imgix.net/6f25dd48-fefe-4e22-984e-e1e3eb741704.png?auto=format"
//       },
//       "cursor": null,
//       "topics": {
//         "nodes": [
//           {
//             "name": "Twitter"
//           },
//           {
//             "name": "Social Media"
//           },
//           {
//             "name": "Social Networking"
//           }
//         ]
//       },
//       "createdAt": "2024-07-03 11:39:00",
//       "featuredAt": "2024-07-03 11:39:00",
//       "uuid": "e13d21e2-d1d4-4f5e-adea-af51da68556c",
//       "s3": false,
//       "webp": true,
//       "added_at": "2024-07-03T13:20:14.463Z",
//       "commentCount": 5
//     },
//     {
//       "id": 467858,
//       "url": "https://www.producthunt.com/posts/hotsuto?utm_campaign=producthunt-api&utm_medium=api-v2&utm_source=Application%3A+HuntScreens+%28ID%3A+109673%29",
//       "name": "Hotsuto",
//       "tagline": "An easy digest for all of your newsletters. ",
//       "description": "Hotsuto gives you a unique burner email to use to sign up for your favorite newsletters, so you don't even have to worry about cleaning up your inbox. They all end up here in an easy to navigate and manage blog like infrastructure",
//       "slug": "hotsuto",
//       "votesCount": 124,
//       "website": "https://hotsuto.com/",
//       "productLinks": [
//         {
//           "type": "Website",
//           "url": "https://www.producthunt.com/r/P67BNSWLII4JKV?utm_campaign=producthunt-api&utm_medium=api-v2&utm_source=Application%3A+HuntScreens+%28ID%3A+109673%29"
//         }
//       ],
//       "thumbnail": {
//         "type": "image",
//         "url": "https://ph-files.imgix.net/cfe5b473-1802-461b-8e7a-a42a6806b5c7.png?auto=format"
//       },
//       "cursor": null,
//       "topics": {
//         "nodes": [
//           {
//             "name": "Email"
//           },
//           {
//             "name": "Productivity"
//           },
//           {
//             "name": "Newsletters"
//           }
//         ]
//       },
//       "createdAt": "2024-07-03 07:01:00",
//       "featuredAt": "2024-07-03 07:01:00",
//       "uuid": "45200a6d-24e5-46a3-b160-b0a0808cd759",
//       "s3": false,
//       "webp": true,
//       "added_at": "2024-07-03T07:20:14.599Z",
//       "commentCount": 79
//     }
//   ]
// }