import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  BookOpen, 
  Video, 
  FileText, 
  Edit3, 
  Trash2, 
  Save,
  X,
  Calendar,
  Clock,
  Users,
  Award,
  Play,
  Upload
} from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import { Course, Week, Lecture, Assignment } from '../../types';
import { 
  getCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  createWeek,
  getWeeks,
  updateWeek,
  deleteWeek,
  createLecture,
  updateLecture,
  deleteLecture,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from '../../services/database';
import toast from 'react-hot-toast';

const ContentManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<{ type: string; item: any } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'weeks' | 'lectures' | 'assignments'>('overview');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchWeeks(selectedCourse.id);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const coursesData = await getCourses();
      setCourses(coursesData);
      if (coursesData.length > 0 && !selectedCourse) {
        setSelectedCourse(coursesData[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeks = async (courseId: string) => {
    try {
      const weeksData = await getWeeks(courseId);
      setWeeks(weeksData);
    } catch (error) {
      toast.error('Failed to fetch weeks');
    }
  };

  // Course handlers
  const handleCreateCourse = async (courseData: any) => {
    try {
      const courseId = await createCourse({
        ...courseData,
        weeks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user-id'
      });
      toast.success('Course created successfully');
      fetchCourses();
      setShowCourseModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  const handleUpdateCourse = async (courseData: any) => {
    if (!editingItem) return;
    
    try {
      await updateCourse(editingItem.id, {
        ...courseData,
        updatedAt: new Date().toISOString()
      });
      toast.success('Course updated successfully');
      fetchCourses();
      setShowCourseModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      toast.success('Course deleted successfully');
      fetchCourses();
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
      }
      setShowDeleteModal(false);
      setDeleteItem(null);
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  // Week handlers
  const handleCreateWeek = async (weekData: any) => {
    if (!selectedCourse) return;
    
    try {
      await createWeek(selectedCourse.id, {
        ...weekData,
        lectures: [],
        assignments: [],
        isActive: false
      });
      toast.success('Week created successfully');
      fetchWeeks(selectedCourse.id);
      setShowWeekModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to create week');
    }
  };

  const handleUpdateWeek = async (weekData: any) => {
    if (!selectedCourse || !editingItem) return;
    
    try {
      await updateWeek(selectedCourse.id, editingItem.id, weekData);
      toast.success('Week updated successfully');
      fetchWeeks(selectedCourse.id);
      setShowWeekModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to update week');
    }
  };

  const handleDeleteWeek = async (weekId: string) => {
    if (!selectedCourse) return;
    
    try {
      await deleteWeek(selectedCourse.id, weekId);
      toast.success('Week deleted successfully');
      fetchWeeks(selectedCourse.id);
      setShowDeleteModal(false);
      setDeleteItem(null);
    } catch (error) {
      toast.error('Failed to delete week');
    }
  };

  // Lecture handlers
  const handleCreateLecture = async (lectureData: any) => {
    if (!selectedCourse || !lectureData.weekId) return;
    
    try {
      await createLecture(selectedCourse.id, lectureData.weekId, {
        ...lectureData,
        resources: [],
        activities: [],
        isPublished: false
      });
      toast.success('Lecture created successfully');
      fetchWeeks(selectedCourse.id);
      setShowLectureModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to create lecture');
    }
  };

  const handleUpdateLecture = async (lectureData: any) => {
    if (!selectedCourse || !editingItem) return;
    
    try {
      await updateLecture(selectedCourse.id, editingItem.weekId, editingItem.id, lectureData);
      toast.success('Lecture updated successfully');
      fetchWeeks(selectedCourse.id);
      setShowLectureModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to update lecture');
    }
  };

  const handleDeleteLecture = async (weekId: string, lectureId: string) => {
    if (!selectedCourse) return;
    
    try {
      await deleteLecture(selectedCourse.id, weekId, lectureId);
      toast.success('Lecture deleted successfully');
      fetchWeeks(selectedCourse.id);
      setShowDeleteModal(false);
      setDeleteItem(null);
    } catch (error) {
      toast.error('Failed to delete lecture');
    }
  };

  // Assignment handlers
  const handleCreateAssignment = async (assignmentData: any) => {
    if (!selectedCourse || !assignmentData.weekId) return;
    
    try {
      await createAssignment(selectedCourse.id, assignmentData.weekId, {
        ...assignmentData,
        questions: assignmentData.questions || [],
        isPublished: false
      });
      toast.success('Assignment created successfully');
      fetchWeeks(selectedCourse.id);
      setShowAssignmentModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to create assignment');
    }
  };

  const handleUpdateAssignment = async (assignmentData: any) => {
    if (!selectedCourse || !editingItem) return;
    
    try {
      await updateAssignment(selectedCourse.id, editingItem.weekId, editingItem.id, assignmentData);
      toast.success('Assignment updated successfully');
      fetchWeeks(selectedCourse.id);
      setShowAssignmentModal(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to update assignment');
    }
  };

  const handleDeleteAssignment = async (weekId: string, assignmentId: string) => {
    if (!selectedCourse) return;
    
    try {
      await deleteAssignment(selectedCourse.id, weekId, assignmentId);
      toast.success('Assignment deleted successfully');
      fetchWeeks(selectedCourse.id);
      setShowDeleteModal(false);
      setDeleteItem(null);
    } catch (error) {
      toast.error('Failed to delete assignment');
    }
  };

  // Edit handlers
  const handleEditCourse = (course: Course) => {
    setEditingItem(course);
    setShowCourseModal(true);
  };

  const handleEditWeek = (week: Week) => {
    setEditingItem(week);
    setShowWeekModal(true);
  };

  const handleEditLecture = (lecture: Lecture) => {
    setEditingItem(lecture);
    setShowLectureModal(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingItem(assignment);
    setShowAssignmentModal(true);
  };

  // Delete confirmation handlers
  const confirmDelete = (type: string, item: any) => {
    setDeleteItem({ type, item });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    switch (deleteItem.type) {
      case 'course':
        await handleDeleteCourse(deleteItem.item.id);
        break;
      case 'week':
        await handleDeleteWeek(deleteItem.item.id);
        break;
      case 'lecture':
        await handleDeleteLecture(deleteItem.item.weekId, deleteItem.item.id);
        break;
      case 'assignment':
        await handleDeleteAssignment(deleteItem.item.weekId, deleteItem.item.id);
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Manager</h1>
          <p className="text-dark-300">Create and manage your course content</p>
        </div>
        <Button onClick={() => setShowCourseModal(true)} icon={<Plus className="h-4 w-4" />}>
          New Course
        </Button>
      </div>

      {/* Course Selection */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Select Course</h2>
          <BookOpen className="h-5 w-5 text-dark-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative ${
                selectedCourse?.id === course.id
                  ? 'border-primary-600 bg-primary-600/10'
                  : 'border-dark-600 hover:border-dark-500'
              }`}
            >
              <div onClick={() => setSelectedCourse(course)}>
                <h3 className="text-white font-semibold mb-2">{course.title}</h3>
                <p className="text-dark-300 text-sm mb-3">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-dark-400">
                  <span>{course.weeks?.length || 0} weeks</span>
                  <span>Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCourse(course);
                  }}
                  icon={<Edit3 className="h-3 w-3" />}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete('course', course);
                  }}
                  icon={<Trash2 className="h-3 w-3" />}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {selectedCourse && (
        <>
          {/* Course Tabs */}
          <Card className="p-6">
            <div className="flex space-x-1 mb-6">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'weeks', label: 'Weeks', icon: Calendar },
                { id: 'lectures', label: 'Lectures', icon: Video },
                { id: 'assignments', label: 'Assignments', icon: FileText }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white'
                        : 'text-dark-300 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-dark-700 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <Calendar className="h-8 w-8 text-primary-400" />
                        <span className="text-2xl font-bold text-white">{weeks.length}</span>
                      </div>
                      <h3 className="text-white font-semibold">Total Weeks</h3>
                      <p className="text-dark-300 text-sm">Course duration</p>
                    </div>
                    <div className="bg-dark-700 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <Video className="h-8 w-8 text-secondary-400" />
                        <span className="text-2xl font-bold text-white">
                          {weeks.reduce((acc, week) => acc + (week.lectures?.length || 0), 0)}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold">Total Lectures</h3>
                      <p className="text-dark-300 text-sm">Video content</p>
                    </div>
                    <div className="bg-dark-700 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <FileText className="h-8 w-8 text-accent-400" />
                        <span className="text-2xl font-bold text-white">
                          {weeks.reduce((acc, week) => acc + (week.assignments?.length || 0), 0)}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold">Total Assignments</h3>
                      <p className="text-dark-300 text-sm">Graded work</p>
                    </div>
                  </div>
                  
                  <div className="bg-dark-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Course Details</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCourse(selectedCourse)}
                        icon={<Edit3 className="h-4 w-4" />}
                      >
                        Edit Course
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-dark-300 text-sm">Title</label>
                        <p className="text-white">{selectedCourse.title}</p>
                      </div>
                      <div>
                        <label className="text-dark-300 text-sm">Description</label>
                        <p className="text-white">{selectedCourse.description}</p>
                      </div>
                      <div className="flex space-x-4">
                        <div>
                          <label className="text-dark-300 text-sm">Created</label>
                          <p className="text-white">{new Date(selectedCourse.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-dark-300 text-sm">Last Updated</label>
                          <p className="text-white">{new Date(selectedCourse.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'weeks' && (
                <motion.div
                  key="weeks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Course Weeks</h3>
                    <Button onClick={() => setShowWeekModal(true)} size="sm" icon={<Plus className="h-4 w-4" />}>
                      Add Week
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {weeks.map((week, index) => (
                      <div key={week.id} className="bg-dark-700 p-6 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">{week.weekNumber}</span>
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{week.title}</h4>
                              <p className="text-dark-300 text-sm">{week.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditWeek(week)}
                              icon={<Edit3 className="h-4 w-4" />} 
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => confirmDelete('week', week)}
                              icon={<Trash2 className="h-4 w-4" />} 
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-dark-300">
                            <Video className="h-4 w-4 mr-2" />
                            {week.lectures?.length || 0} lectures
                          </div>
                          <div className="flex items-center text-dark-300">
                            <FileText className="h-4 w-4 mr-2" />
                            {week.assignments?.length || 0} assignments
                          </div>
                          <div className="flex items-center text-dark-300">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(week.startDate).toLocaleDateString()} - {new Date(week.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'lectures' && (
                <motion.div
                  key="lectures"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">All Lectures</h3>
                    <Button onClick={() => setShowLectureModal(true)} size="sm" icon={<Plus className="h-4 w-4" />}>
                      Add Lecture
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {weeks.map((week) => 
                      week.lectures?.map((lecture) => (
                        <div key={lecture.id} className="bg-dark-700 p-6 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-secondary-600 rounded-lg flex items-center justify-center">
                                <Video className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">{lecture.title}</h4>
                                <p className="text-dark-300 text-sm">Week {week.weekNumber} • {lecture.duration || 0} minutes</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                lecture.isPublished ? 'bg-accent-600 text-white' : 'bg-orange-600 text-white'
                              }`}>
                                {lecture.isPublished ? 'Published' : 'Draft'}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditLecture(lecture)}
                                icon={<Edit3 className="h-4 w-4" />} 
                              />
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => confirmDelete('lecture', lecture)}
                                icon={<Trash2 className="h-4 w-4" />} 
                              />
                            </div>
                          </div>
                          
                          <p className="text-dark-300 text-sm mb-4">{lecture.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-dark-400">
                            <span>{lecture.resources?.length || 0} resources</span>
                            <span>{lecture.activities?.length || 0} activities</span>
                            {lecture.videoUrl && (
                              <div className="flex items-center">
                                <Play className="h-4 w-4 mr-1" />
                                Video available
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'assignments' && (
                <motion.div
                  key="assignments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">All Assignments</h3>
                    <Button onClick={() => setShowAssignmentModal(true)} size="sm" icon={<Plus className="h-4 w-4" />}>
                      Add Assignment
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {weeks.map((week) => 
                      week.assignments?.map((assignment) => (
                        <div key={assignment.id} className="bg-dark-700 p-6 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-accent-600 rounded-lg flex items-center justify-center">
                                <FileText className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">{assignment.title}</h4>
                                <p className="text-dark-300 text-sm">Week {week.weekNumber} • {assignment.type}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                assignment.isPublished ? 'bg-accent-600 text-white' : 'bg-orange-600 text-white'
                              }`}>
                                {assignment.isPublished ? 'Published' : 'Draft'}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditAssignment(assignment)}
                                icon={<Edit3 className="h-4 w-4" />} 
                              />
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => confirmDelete('assignment', assignment)}
                                icon={<Trash2 className="h-4 w-4" />} 
                              />
                            </div>
                          </div>
                          
                          <p className="text-dark-300 text-sm mb-4">{assignment.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-dark-400">
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-1" />
                              {assignment.totalPoints} points
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Due {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-1" />
                              {assignment.questions?.length || 0} questions
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {assignment.attempts} attempts
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </>
      )}

      {/* Modals */}
      <CourseModal
        isOpen={showCourseModal}
        onClose={() => {
          setShowCourseModal(false);
          setEditingItem(null);
        }}
        onSubmit={editingItem ? handleUpdateCourse : handleCreateCourse}
        course={editingItem}
      />
      
      <WeekModal
        isOpen={showWeekModal}
        onClose={() => {
          setShowWeekModal(false);
          setEditingItem(null);
        }}
        onSubmit={editingItem ? handleUpdateWeek : handleCreateWeek}
        week={editingItem}
        weekNumber={weeks.length + 1}
      />
      
      <LectureModal
        isOpen={showLectureModal}
        onClose={() => {
          setShowLectureModal(false);
          setEditingItem(null);
        }}
        onSubmit={editingItem ? handleUpdateLecture : handleCreateLecture}
        lecture={editingItem}
        weeks={weeks}
      />
      
      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => {
          setShowAssignmentModal(false);
          setEditingItem(null);
        }}
        onSubmit={editingItem ? handleUpdateAssignment : handleCreateAssignment}
        assignment={editingItem}
        weeks={weeks}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteItem(null);
        }}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-dark-300">
            Are you sure you want to delete this {deleteItem?.type}? This action cannot be undone.
          </p>
          {deleteItem?.item && (
            <div className="bg-dark-700 p-4 rounded-lg">
              <p className="text-white font-medium">{deleteItem.item.title}</p>
              {deleteItem.item.description && (
                <p className="text-dark-300 text-sm mt-1">{deleteItem.item.description}</p>
              )}
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteItem(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleConfirmDelete}
            >
              Delete {deleteItem?.type}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Course Modal Component
const CourseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  course?: any;
}> = ({ isOpen, onClose, onSubmit, course }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || ''
      });
    } else {
      setFormData({ title: '', description: '' });
    }
  }, [course, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', description: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={course ? 'Edit Course' : 'Create New Course'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Course Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter course title"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter course description"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {course ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Week Modal Component
const WeekModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  week?: any;
  weekNumber: number;
}> = ({ isOpen, onClose, onSubmit, week, weekNumber }) => {
  const [formData, setFormData] = useState({
    weekNumber: weekNumber,
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (week) {
      setFormData({
        weekNumber: week.weekNumber || weekNumber,
        title: week.title || '',
        description: week.description || '',
        startDate: week.startDate?.split('T')[0] || '',
        endDate: week.endDate?.split('T')[0] || ''
      });
    } else {
      setFormData({
        weekNumber,
        title: '',
        description: '',
        startDate: '',
        endDate: ''
      });
    }
  }, [week, weekNumber, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString()
    });
    setFormData({ weekNumber: weekNumber + 1, title: '', description: '', startDate: '', endDate: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={week ? 'Edit Week' : 'Create New Week'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Week Number</label>
          <input
            type="number"
            value={formData.weekNumber}
            onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) })}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Week Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter week title"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter week description"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {week ? 'Update Week' : 'Create Week'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Lecture Modal Component
const LectureModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  lecture?: any;
  weeks: Week[];
}> = ({ isOpen, onClose, onSubmit, lecture, weeks }) => {
  const [formData, setFormData] = useState({
    weekId: '',
    title: '',
    description: '',
    videoUrl: '',
    duration: 0,
    order: 1,
    isPublished: false
  });

  useEffect(() => {
    if (lecture) {
      setFormData({
        weekId: lecture.weekId || '',
        title: lecture.title || '',
        description: lecture.description || '',
        videoUrl: lecture.videoUrl || '',
        duration: lecture.duration || 0,
        order: lecture.order || 1,
        isPublished: lecture.isPublished || false
      });
    } else {
      setFormData({
        weekId: weeks[0]?.id || '',
        title: '',
        description: '',
        videoUrl: '',
        duration: 0,
        order: 1,
        isPublished: false
      });
    }
  }, [lecture, weeks, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ weekId: '', title: '', description: '', videoUrl: '', duration: 0, order: 1, isPublished: false });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lecture ? 'Edit Lecture' : 'Create New Lecture'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Week</label>
          <select
            value={formData.weekId}
            onChange={(e) => setFormData({ ...formData, weekId: e.target.value })}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="">Select a week</option>
            {weeks.map((week) => (
              <option key={week.id} value={week.id}>
                Week {week.weekNumber}: {week.title}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Lecture Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter lecture title"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter lecture description"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Video URL</label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="https://example.com/video.mp4"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              min="1"
              required
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="w-4 h-4 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
          />
          <label htmlFor="isPublished" className="ml-2 text-sm text-dark-300">
            Publish immediately
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {lecture ? 'Update Lecture' : 'Create Lecture'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Assignment Modal Component
const AssignmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  assignment?: any;
  weeks: Week[];
}> = ({ isOpen, onClose, onSubmit, assignment, weeks }) => {
  const [formData, setFormData] = useState({
    weekId: '',
    title: '',
    description: '',
    type: 'homework' as 'homework' | 'quiz' | 'project',
    totalPoints: 100,
    dueDate: '',
    timeLimit: 0,
    attempts: 1,
    isPublished: false
  });

  useEffect(() => {
    if (assignment) {
      setFormData({
        weekId: assignment.weekId || '',
        title: assignment.title || '',
        description: assignment.description || '',
        type: assignment.type || 'homework',
        totalPoints: assignment.totalPoints || 100,
        dueDate: assignment.dueDate?.split('T')[0] || '',
        timeLimit: assignment.timeLimit || 0,
        attempts: assignment.attempts || 1,
        isPublished: assignment.isPublished || false
      });
    } else {
      setFormData({
        weekId: weeks[0]?.id || '',
        title: '',
        description: '',
        type: 'homework',
        totalPoints: 100,
        dueDate: '',
        timeLimit: 0,
        attempts: 1,
        isPublished: false
      });
    }
  }, [assignment, weeks, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString()
    });
    setFormData({ weekId: '', title: '', description: '', type: 'homework', totalPoints: 100, dueDate: '', timeLimit: 0, attempts: 1, isPublished: false });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={assignment ? 'Edit Assignment' : 'Create New Assignment'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Week</label>
          <select
            value={formData.weekId}
            onChange={(e) => setFormData({ ...formData, weekId: e.target.value })}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="">Select a week</option>
            {weeks.map((week) => (
              <option key={week.id} value={week.id}>
                Week {week.weekNumber}: {week.title}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Assignment Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter assignment title"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter assignment description"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="homework">Homework</option>
              <option value="quiz">Quiz</option>
              <option value="project">Project</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Total Points</label>
            <input
              type="number"
              value={formData.totalPoints}
              onChange={(e) => setFormData({ ...formData, totalPoints: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              min="1"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Due Date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Time Limit (minutes)</label>
            <input
              type="number"
              value={formData.timeLimit}
              onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              min="0"
              placeholder="0 for unlimited"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Attempts Allowed</label>
            <input
              type="number"
              value={formData.attempts}
              onChange={(e) => setFormData({ ...formData, attempts: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              min="1"
              required
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="assignmentPublished"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="w-4 h-4 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
          />
          <label htmlFor="assignmentPublished" className="ml-2 text-sm text-dark-300">
            Publish immediately
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {assignment ? 'Update Assignment' : 'Create Assignment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ContentManager;