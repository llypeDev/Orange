import { Avatar, Badge } from '@orange/ui'

const chats = [
  { name: 'Mariana Lopes', unread: 2 },
  { name: 'Rafael Costa', unread: 0 },
  { name: 'Suporte Orange', unread: 14 },
]

export default function OnAvatar() {
  return (
    <>
      {chats.map((chat) => (
        <Badge
          key={chat.name}
          count={chat.unread}
          label={`${chat.unread} mensagens não lidas`}
          overlap="circle"
          size="sm"
        >
          <Avatar name={chat.name} shape="circle" size="lg" />
        </Badge>
      ))}
    </>
  )
}
