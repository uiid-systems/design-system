"use client";

import { useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { differenceInDays } from "date-fns";

import type { CalendarEvent } from "../event-calendar.types";
