"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
//http://localhost:8000/notifications?receiverId=68b4fbd28c0d11ccc8eda2ae
// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: "booking",
    title: "Booking Confirmed",
    message: "Your bus ticket for Route 45A has been confirmed for Dec 15, 2024 at 2:30 PM",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "cancellation",
    title: "Bus Ride Cancelled",
    message: "Route 23B scheduled for Dec 14, 2024 at 8:00 AM has been cancelled due to weather conditions",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "booking",
    title: "Payment Received",
    message: "Payment of $25.50 for your booking #BK-2024-1205 has been processed successfully",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "delay",
    title: "Route Delay",
    message: "Route 12C is running 15 minutes late. New estimated arrival: 4:45 PM",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "booking",
    title: "Seat Upgrade Available",
    message: "Premium seats are now available for your upcoming trip on Route 67D",
    time: "1 day ago",
    read: false,
  },
]

export function NotificationBell() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return "🎫"
      case "cancellation":
        return "❌"
      case "delay":
        return "⏰"
      default:
        return "📢"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative bg-white">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">{unreadCount > 9 ? "9+" : unreadCount}</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-4 cursor-pointer hover:bg-muted/50"
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <span className="text-lg flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{notification.title}</p>
                      {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center text-sm text-muted-foreground">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
