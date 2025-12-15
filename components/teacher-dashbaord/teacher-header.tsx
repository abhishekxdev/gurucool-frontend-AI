"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  IconChartBar,
  IconListDetails,
  IconSchool,
  IconTrophy,
  IconUserCircle,
  IconWallpaper,
} from "@tabler/icons-react";
import {
  Bell,
  Check,
  FileText,
  MessageSquare,
  Search,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface AdminHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  breadcrumbs: BreadcrumbItemType[];
  notificationCount?: number;
}

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: "submission",
    title: "Sarah Johnson",
    message: "submitted assignment Math Quiz 5",
    time: "5 min ago",
    avatar: "/avatars/student1.jpg",
    initials: "SJ",
    unread: true,
    icon: <Upload className="size-3" />,
    color: "bg-blue-500",
  },
  {
    id: 2,
    type: "approval",
    title: "John Smith",
    message: "requests approval for Science Lab Report",
    time: "1 hour ago",
    avatar: "/avatars/student2.jpg",
    initials: "JS",
    unread: true,
    icon: <Check className="size-3" />,
    color: "bg-purple-500",
    actions: [
      { label: "Deny", variant: "ghost" as const },
      { label: "Approve", variant: "default" as const },
    ],
  },
  {
    id: 3,
    type: "upload",
    title: "Emma Wilson",
    message: "uploaded essay.pdf for English Literature",
    time: "2 hours ago",
    avatar: "/avatars/student3.jpg",
    initials: "EW",
    unread: true,
    icon: <FileText className="size-3" />,
    color: "bg-green-500",
    attachment: {
      name: "essay.pdf",
      size: "2.4mb",
    },
  },
  {
    id: 4,
    type: "comment",
    title: "Michael Brown",
    message: "commented on your feedback: Thanks for the detailed review! 🚀",
    time: "1 day ago",
    avatar: "/avatars/student4.jpg",
    initials: "MB",
    unread: false,
    icon: <MessageSquare className="size-3" />,
    color: "bg-orange-500",
  },
  {
    id: 5,
    type: "join",
    title: "New Student",
    message: "Alex Taylor joined your Physics class",
    time: "2 days ago",
    avatar: "/avatars/student5.jpg",
    initials: "AT",
    unread: false,
    icon: <UserPlus className="size-3" />,
    color: "bg-pink-500",
  },
];

const TeacherHeader: React.FC<AdminHeaderProps> = ({
  title,
  description,
  icon,
  breadcrumbs,
  notificationCount = 0,
}) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const searchItems = [
    {
      label: "Overview",
      icon: <IconSchool className="size-4" />,
      href: "/teacher/dashboard",
    },
    {
      label: "Assessments",
      icon: <IconChartBar className="size-4" />,
      href: "/teacher/dashboard/assessments",
    },
    {
      label: "Learning",
      icon: <IconWallpaper className="size-4" />,
      href: "/teacher/dashboard/learning",
    },
    {
      label: "Performance",
      icon: <IconListDetails className="size-4" />,
      href: "/teacher/dashboard/results",
    },
    {
      label: "Achievements",
      icon: <IconTrophy className="size-4" />,
      href: "/teacher/dashboard/certificates",
    },
    {
      label: "Account",
      icon: <IconUserCircle className="size-4" />,
      href: "/teacher/dashboard/profile",
    },
  ];

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setShowClearDialog(false);
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      <header className="sticky top-0 z-10 border-b-2 border-dashed bg-background font-[montserrat] py-2 mb-4">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between gap-3 px-4 py-3">
          {/* Left - Sidebar Trigger, Icon and Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <SidebarTrigger className="flex-shrink-0" />
            {icon && (
              <div className="flex items-center justify-center text-primary flex-shrink-0 [&_svg]:size-6 [&_svg]:stroke-[1.5]">
                {icon}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm font-medium truncate leading-tight">
                {title}
              </h1>
              {description && (
                <p className="text-xs text-muted-foreground truncate leading-tight">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right - Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(true)}
              className="relative"
            >
              <Search className="size-4" />
              <span className="sr-only">Search</span>
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => router.push("/teacher/dashboard/notifications")}
              className="relative"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </div>

        {/* Mobile Breadcrumbs - Below main header */}
        <div className="flex md:hidden border-t px-4 py-2">
          <Breadcrumb>
            <BreadcrumbList className="flex-wrap">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem className="text-xs">
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : crumb.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-6 px-6 py-3">
          {/* Left side - Icon, Title and Description */}
          <div className="flex items-center gap-3 min-w-0 max-w-md">
            {icon && (
              <div className="flex items-center justify-center text-primary flex-shrink-0 [&_svg]:size-6 [&_svg]:stroke-[1.5]">
                {icon}
              </div>
            )}

            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="text-sm font-semibold truncate">{title}</h1>
              {description && (
                <p className="text-xs text-muted-foreground truncate">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Center - Breadcrumbs */}
          <div className="flex-1 flex items-center justify-center min-w-0">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem className="text-sm">
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : crumb.href ? (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <span>{crumb.label}</span>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right side - Search and Notification */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search Button with visible shortcut */}
            <Button
              variant="secondary"
              size="default"
              onClick={() => setOpen(true)}
              className="relative gap-2 px-3"
            >
              <Search className="size-4" />
              <span className="text-xs text-muted-foreground hidden lg:inline">
                Search
              </span>
              <kbd className="hidden xl:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
              <span className="sr-only">Search (Cmd+K)</span>
            </Button>

            {/* Notification Button with Preview */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="icon" className="relative">
                  <span className="relative inline-flex">
                  <Bell className="size-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[400px] p-0 font-[inter]"
                align="end"
                sideOffset={8}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 pb-3">
                  <h4 className="font-semibold text-base">Notifications</h4>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs text-primary"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </Button>
                    {notifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setShowClearDialog(true)}
                        className="h-7 w-7"
                        title="Clear all notifications"
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 px-4 pb-3 border-b">
                  <button className="text-sm font-medium pb-2 border-b-2 border-primary">
                    All
                  </button>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Inbox
                    {unreadCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1.5 h-5 px-1.5 text-[10px]"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </button>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Following
                  </button>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Archived
                  </button>
                </div>

                {/* Notifications List */}
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Bell className="size-12 text-muted-foreground/50 mb-4" />
                    <h3 className="font-semibold text-sm mb-1">
                      No notifications
                    </h3>
                    <p className="text-xs text-muted-foreground text-center">
                      You're all caught up! Check back later for updates.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="divide-y">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "relative p-4 hover:bg-accent/50 transition-colors cursor-pointer group",
                            notification.unread && "bg-accent/30"
                          )}
                        >
                          <div className="flex gap-3">
                            {/* Avatar with Icon Badge */}
                            <div className="relative flex-shrink-0">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={notification.avatar} />
                                <AvatarFallback className="text-xs">
                                  {notification.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={cn(
                                  "absolute -bottom-0.5 -right-0.5 rounded-full p-1 text-white",
                                  notification.color
                                )}
                              >
                                {notification.icon}
                              </div>
                              {notification.unread && (
                                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm flex-1">
                                  <span className="font-semibold">
                                    {notification.title}
                                  </span>{" "}
                                  <span className="text-muted-foreground">
                                    {notification.message}
                                  </span>
                                </p>
                                {/* Individual notification delete button */}
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove notification"
                                >
                                  <Trash2 className="size-3" />
                                </Button>
                              </div>

                              <p className="text-xs text-muted-foreground">
                                {notification.time}
                              </p>

                              {/* Attachment */}
                              {notification.attachment && (
                                <div className="flex items-center gap-2 mt-2 p-2 rounded-md bg-muted/50 border">
                                  <FileText className="size-4 text-muted-foreground" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">
                                      {notification.attachment.name}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                      {notification.attachment.size}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Action Buttons */}
                              {notification.actions && (
                                <div className="flex items-center gap-2 mt-2">
                                  {notification.actions.map((action, idx) => (
                                    <Button
                                      key={idx}
                                      variant={action.variant}
                                      size="sm"
                                      className="h-7 text-xs px-3"
                                    >
                                      {action.label}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {/* Footer */}
                <div className="border-t p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Use <kbd className="px-1 py-0.5 rounded bg-muted">→</kbd>{" "}
                      to navigate
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() =>
                        router.push("/teacher/dashboard/notifications")
                      }
                    >
                      ⚙️ Manage Notification
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Search Command Dialog */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="font-[inter]"
      >
        <CommandInput placeholder="Search pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {searchItems.map((item, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  router.push(item.href);
                  setOpen(false);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Clear All Notifications Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="font-[inter]">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your notifications. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearAllNotifications}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TeacherHeader;
