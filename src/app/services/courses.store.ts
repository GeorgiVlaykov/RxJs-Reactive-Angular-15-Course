import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { map, shareReplay, catchError, tap, filter } from "rxjs/operators";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    // private coursesService: CoursesService,
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    this.loadAllCourses();
  }

  private loadAllCourses() {
    console.log("loading courses...");

    const loadAllCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      catchError((err) => {
        const message = "Could not load courses";
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap((courses) => this.subject.next(courses))
    );
    const loadCourses$ = this.loadingService
      .showLoaderUntilCompleted(loadAllCourses$)
      .subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue();

    const index = courses.findIndex((course) => course.id == courseId);
    const newCourse: Course = {
      ...courses[index],
      ...changes,
    };

    // console.log("changes:", changes);
    // console.log("Course value courses[index]:", courses[index]);
    // console.log("Updated newCourse value:", newCourse);

    const newCoursesArray: Course[] = courses.slice(0);
    console.log("Current courses[] value:", courses);
    console.log("Current newCoursesArray[] value:", newCoursesArray);

    newCoursesArray[index] = newCourse;
    console.log("New courses array at index:", newCoursesArray[index]);

    this.subject.next(newCoursesArray);

    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const message = "Could not save course";
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      shareReplay()
    );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      tap((courses) => console.log("Filter Courses", courses)),
      filter((courses) => !!courses && courses.length > 0),
      map((courses) =>
        courses
          .filter((course) => course.category == category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
