# _!! UNDER CONSTRUCTION !!_ Formerly known as 'Random-Student-Name Generator'. This project will undergo a lot of changes once I find the time. It is still usable in it's old form with the linked vercel app. The repo name has already been changed to the new project name 'Teacherbuddy'. Stay tuned.

> The following is the old README. The README will be updated once the updated App is Live.

## Random-Student-Name-Generator

## Introduction

When I started the Web Development course at the [Digital Career Institute](https://github.com/DigitalCareerInstitute), I quickly noticed that students (myself included) felt too shy to put their hands up when the teacher asked a question about what we had learned the previous day or when it was time to present our solutions for our afternoon assignments.

To make things easier for the teachers to pick a student, I came up with the idea of a generator ([v1](https://github.com/mrbubbles-src/random-name-gen-v1), [v2](https://github.com/mrbubbles-src/random-name-gen-v2)) that randomly picks a student for the teacher to choose.

This is now the final version, which I began working on just when we started with our REACT/SPA module, so please be nice about the level of code and structure I use in most of the project 😁! I promise, my code looks a lot nicer now and whenever I have the time and mental space for it, I will update the whole code to represent that and fix left-over bugs!

Try it out! [> Click me <](https://random-student-name-generator.vercel.app/)

## How to use

### The initial setup:

- Enter the names of your students **one at a time** with the input field at the top and press submit **after each name**
  - This will save each individual student name in your **local storage**, so unless you delete that, you'll only need to do that once
- Either press the 'Reset Generator' button or reload the page
  - You only need to do this **once** after you've entered all names (if you add an additional name later on or clear out your local storage/delete an individual Name while on the page, you also need to press 'Reset Generator' once again). This is currently a sort-of bug that is on my to-do list

### Using the Generator after the setup

- Just press the 'Generate!' button and the magic happens!
  - The student name you generate will be crossed out in the list, so you can take a quick glance at who hasn't been chosen yet
- Once every name is used up, the 'Generate!' button disappears and a message tells you that there are no more names. Just press the 'Reset Generator' button or reload the page, so you can start generating again

If the unfortunate event happens that a student drops out of the course and you want to remove their name from the list, currently you need to **manually** remove the **individual** name (or clear all of course) from your local storage.

## On my to-do list

- Option to also import a batch of student names (for example via a file)
- Option to delete student name via input field
  - maybe a clear all button?
- Remove the need for a reload so that names can be reloaded
- Dark mode! 😎
  - With a toggle
  - And preference saved
- Rework app to be in line with my own current standards
